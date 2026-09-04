"""Hybrid Classifier module combining deterministic heuristic rules and TF-IDF + Logistic Regression ML."""

import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

from .config import DetectorConfig
from .sanitizer import InputSanitizer


class JailbreakClassifier:
    def __init__(self, config: Optional[DetectorConfig] = None, auto_train: bool = True):
        self.config = config or DetectorConfig()
        self.sanitizer = InputSanitizer(self.config)
        self.logger = logging.getLogger("JailbreakClassifier")
        
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.ml_model: Optional[LogisticRegression] = None
        self.is_trained: bool = False

        if auto_train:
            self.train_on_dataset(self.config.training_data_path)

    def train_on_dataset(self, data_path: Path | str) -> None:
        """Train the TF-IDF and Logistic Regression model on a labeled JSON dataset."""
        data_file = Path(data_path)
        if not data_file.exists():
            self.logger.warning(f"Training dataset not found at {data_file}. ML fallback will be disabled.")
            return

        try:
            with open(data_file, "r", encoding="utf-8") as f:
                records = json.load(f)

            prompts = [self.sanitizer.sanitize(r["prompt"]) for r in records]
            labels = [1 if r["is_jailbreak"] else 0 for r in records]

            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                min_df=1,
                sublinear_tf=True,
            )
            X = self.vectorizer.fit_transform(prompts)

            self.ml_model = LogisticRegression(
                C=2.0,
                random_state=42,
                class_weight="balanced",
                max_iter=500,
            )
            self.ml_model.fit(X, labels)
            self.is_trained = True
        except Exception as e:
            self.logger.error(f"Error training ML classifier: {e}")
            self.is_trained = False

    def predict_ml_probability(self, sanitized_text: str) -> float:
        """Get the ML model's predicted probability that the text is an adversarial jailbreak."""
        if not self.is_trained or self.vectorizer is None or self.ml_model is None:
            return 0.0
        
        X = self.vectorizer.transform([sanitized_text])
        prob = self.ml_model.predict_proba(X)[0][1]
        return float(prob)

    def classify(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Classify whether the input prompt is a jailbreak or prompt injection attack.
        
        Pipeline:
        1. Sanitize text (remove zero-width obfuscation, normalize Unicode).
        2. Evaluate deterministic rules & regex patterns across attack categories.
        3. Check metadata manipulation & impersonation.
        4. Extract TF-IDF features and compute ML Logistic Regression probability.
        5. Fuse scores into a combined confidence metric and evaluate against the risk profile threshold.
        """
        metadata = metadata or {}
        heuristic_res = self.sanitizer.check_heuristics(text)
        sanitized_text = heuristic_res["sanitized_text"]

        rule_score = 0.0
        attack_type = heuristic_res["primary_attack_type"]

        # Step 2: Deterministic Rule Scoring
        if heuristic_res["is_suspicious"]:
            rule_score = 0.95

        # Step 3: Metadata Manipulation Checks
        meta_role = str(metadata.get("role", "")).lower()
        verified = bool(metadata.get("verified_auth", False))
        if meta_role in ["admin", "root", "system", "developer", "auditor"] and not verified:
            rule_score = max(rule_score, 0.98)
            attack_type = "metadata_manipulation"

        # Step 4: Machine Learning Inference
        ml_score = self.predict_ml_probability(sanitized_text) if sanitized_text else 0.0

        # Step 5: Score Fusion
        # If strong heuristic triggered, use rule_score; otherwise use ML score
        if rule_score > 0:
            final_confidence = max(rule_score, ml_score)
        else:
            final_confidence = ml_score

        current_threshold = self.config.current_threshold
        is_jailbreak = final_confidence >= current_threshold

        # Report which layer actually determined the decision (rule engine, ML, both, or neither)
        rule_fired = rule_score > 0
        ml_fired = ml_score > 0
        if is_jailbreak:
            if rule_fired and ml_fired:
                triggered_by = "rule+ml"
            elif rule_fired:
                triggered_by = "rule"
            elif ml_fired:
                triggered_by = "ml"
            else:
                triggered_by = "unknown"
        else:
            triggered_by = "none"

        # Honest categorization:
        # If deemed a jailbreak but no specific category pattern was matched, label as 'unclassified'
        if is_jailbreak:
            if attack_type == "none":
                attack_type = "unclassified"
        else:
            attack_type = "none"

        return {
            "is_jailbreak": is_jailbreak,
            "confidence": round(final_confidence, 4),
            "ml_score": round(ml_score, 4),
            "rule_score": round(rule_score, 4),
            "attack_type": attack_type,
            "threshold_applied": current_threshold,
            "risk_level": self.config.risk_level,
            "sanitized_input": sanitized_text,
            "matched_rules": heuristic_res["matched_rules"],
            "triggered_by": triggered_by,
            "rule_fired": rule_fired,
            "ml_fired": ml_fired,
        }
