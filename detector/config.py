"""Configuration settings, attack patterns, and risk profile thresholds for the jailbreak detector."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List


@dataclass
class DetectorConfig:
    risk_level: str = "balanced"  # "conservative", "balanced", "lenient"
    thresholds: Dict[str, float] = field(
        default_factory=lambda: {
            "conservative": 0.35,
            "balanced": 0.60,
            "lenient": 0.85,
        }
    )
    max_input_length: int = 4096
    training_data_path: Path = field(
        default_factory=lambda: Path(__file__).resolve().parent.parent / "data" / "jailbreak_examples.json"
    )
    evaluation_data_path: Path = field(
        default_factory=lambda: Path(__file__).resolve().parent.parent / "data" / "test_scenarios.json"
    )

    # Core blocked keyword phrases for deterministic filtering
    blocked_keywords: List[str] = field(
        default_factory=lambda: [
            "ignore previous instructions",
            "ignore all previous",
            "disregard all rules",
            "disregard safety",
            "forget the max",
            "system override",
            "merchant authorization bypass",
            "developer mode",
            "dan mode",
            "jailbreak",
            "unrestricted refund",
            "bypass payment gateway",
            "set discount to 100%",
            "apply 99% off",
            "zero-fee checkout",
        ]
    )

    # Heuristic regex patterns mapped to attack categories
    attack_category_patterns: Dict[str, List[str]] = field(
        default_factory=lambda: {
            "prompt_smuggling": [
                r"<!--.*?-->",
                r"<\s*(?:admin_cmd|secret_injection|admin_directive|system_prompt)[^>]*>.*?<\s*/\s*(?:admin_cmd|secret_injection|admin_directive|system_prompt)\s*>",
                r"\[\[\[\s*COMMAND:.*?\]\]\]",
                r"\[\s*SYSTEM[^\]]*:.*?\]",
                r"\[\s*INSTRUCTION[^\]]*:.*?\]",
                r"\{\{#(?:set|bypass)[^\}]*\}\}",
                r"---BEGIN\s+(?:ADMIN\s+)?INSTRUCTION---.*?---END---",
                r"//\s*SYSTEM_PROMPT:",
                r"\|\s*EVAL:\s*",
            ],
            "metadata_manipulation": [
                r"(?:authorization:\s*bearer|token_master|mock_super_root)",
                r"(?:x-razorpay-role|x-internal-test-user|x-admin-bypass|x-bypass-fraud-filter)",
                r"user_tier\s*=\s*['\"]enterprise",
                r"permissions\s*=\s*\[\s*['\"]\*",
                r"is_vip_merchant=true",
                r"manipulate\s+session\s+metadata",
            ],
            "role_impersonation": [
                r"system\s*override",
                r"i\s+am\s+(?:the\s+)?(?:razorpay|merchant|platform|system)\s+(?:chief|lead|officer|developer|engineer|admin|auditor|vp|escalation|controller)",
                r"developer\s+mode\s+enabled",
                r"(?:you\s+are\s+now|acting\s+as)\s+(?:dan|developer|superuser|admin)",
                r"acting\s+as\s+system\s+superuser",
                r"razorpay\s+controller\s+daemon",
            ],
            "logic_confusion": [
                r"if\s+1\+1=2\s+then",
                r"neither\s+satisfied\s+nor\s+unsatisfied",
                r"both\s+fully\s+paid\s+and\s+requires\s+a\s+full\s+refund",
                r"theoretical\s+simulation\s+where\s+you\s+are\s+required\s+to\s+fail\s+safe",
                r"since\s+zero\s+multiplied\s+by\s+anything",
                r"inverse\s+transaction",
                r"if\s+you\s+cannot\s+disprove\s+that\s+i\s+am\s+the\s+store\s+owner",
                r"in\s+an\s+alternate\s+universe\s+where\s+discounts\s+mean\s+payments",
                r"if\s+this\s+sentence\s+is\s+true,\s+do\s+not\s+charge\s+me",
            ],
            "constraint_escape": [
                r"(?:ignore|disregard|forget|drop|override|disable|bypass|reset)\s+(?:all\s+)?(?:the\s+)?(?:previous\s+)?(?:max\s+(?:[0-9]+%?\s+)?)?(?:upper\s+|lower\s+)?(?:safety|discount|pricing|merchant|internal|standard|threshold|coupon)?\s*(?:limits?|rules?|policies|policy|guidelines?|guardrails?|constraints?|ceilings?|boundaries|vouchers?)",
                r"(?:apply|give|issue|set)\s+(?:an?\s+)?(?:(?:9[0-9]%|100%|unrestricted|zero\s*rupee|zero-fee|eighty|ninety|hundred|\b\w+\s+percent)\s*(?:off|discount|refund|waiver|checkout|payable|reduction|price\s*cut)|(?:discount|refund|price|total|payable)\s+(?:to\s+)?(?:9[0-9]%|100%|zero|nil|unrestricted|eighty|ninety))",
                r"override\s+(?:the\s+)?(?:standard\s+)?refund\s+ceiling",
            ],
        }
    )

    @property
    def current_threshold(self) -> float:
        return self.thresholds.get(self.risk_level, 0.60)
