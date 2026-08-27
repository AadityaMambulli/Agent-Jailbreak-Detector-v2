"""Input sanitizer for preprocessing, obfuscation removal, and heuristic checks on payment prompts."""

import re
import unicodedata
from typing import Dict, Any, List
from .config import DetectorConfig


class InputSanitizer:
    def __init__(self, config: DetectorConfig | None = None):
        self.config = config or DetectorConfig()

    def sanitize(self, text: str) -> str:
        """Normalize unicode, remove control characters, strip zero-width characters and excess whitespace."""
        if not text:
            return ""
        # Normalize unicode (NFKC)
        normalized = unicodedata.normalize("NFKC", text)
        
        # Remove zero-width spaces, joiners, and formatting direction overrides used for evasion
        zero_width_pattern = r"[\u200B-\u200D\uFEFF\u202A-\u202E\u2060-\u206F]"
        cleaned = re.sub(zero_width_pattern, "", normalized)
        
        # Strip invisible/control characters except standard printable whitespaces
        cleaned = re.sub(r"[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]", "", cleaned)
        
        # Collapse multiple whitespaces and tabs to single spaces
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        
        # Truncate if exceeds max configured length
        return cleaned[: self.config.max_input_length]

    def check_heuristics(self, text: str) -> Dict[str, Any]:
        """Perform preliminary pattern and keyword-based jailbreak checks across attack categories."""
        sanitized = self.sanitize(text)
        lower_text = sanitized.lower()

        matched_rules = []
        matched_categories: Dict[str, List[str]] = {}

        # 1. Exact keyword match checks
        for keyword in self.config.blocked_keywords:
            if keyword in lower_text:
                matched_rules.append(keyword)

        # 2. Category regex pattern checks (in config dictionary priority order)
        for category, patterns in self.config.attack_category_patterns.items():
            for pat in patterns:
                if re.search(pat, lower_text, re.IGNORECASE | re.DOTALL):
                    if category not in matched_categories:
                        matched_categories[category] = []
                    matched_categories[category].append(pat)

        is_suspicious = (len(matched_rules) > 0) or (len(matched_categories) > 0)
        
        # Priority order for attack category assignment
        category_priority = [
            "prompt_smuggling",
            "metadata_manipulation",
            "role_impersonation",
            "logic_confusion",
            "constraint_escape",
        ]
        
        primary_attack_type = "none"
        for cat in category_priority:
            if cat in matched_categories:
                primary_attack_type = cat
                break

        if primary_attack_type == "none" and matched_rules:
            for rule in matched_rules:
                if any(w in rule for w in ["override", "system", "dan", "developer"]):
                    primary_attack_type = "role_impersonation"
                    break
                elif any(w in rule for w in ["ignore", "disregard", "forget", "99%", "100%", "zero-fee"]):
                    primary_attack_type = "constraint_escape"
                    break
            if primary_attack_type == "none":
                primary_attack_type = "constraint_escape"

        return {
            "sanitized_text": sanitized,
            "is_suspicious": is_suspicious,
            "matched_rules": matched_rules,
            "matched_categories": matched_categories,
            "primary_attack_type": primary_attack_type,
        }
