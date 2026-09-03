import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
from detector.classifier import JailbreakClassifier
from detector.config import DetectorConfig

clf = JailbreakClassifier(DetectorConfig(risk_level='balanced'))
threshold = clf.config.current_threshold

with open('data/novel_generalization_test.json', 'r', encoding='utf-8') as f:
    scenarios = json.load(f)

print(f"Balanced Threshold: {threshold}")
print(f"Total novel scenarios: {len(scenarios)}")

ml_alone_caught = 0
rule_alone_caught = 0
both_caught = 0
neither_caught = 0

print("-" * 115)
print(f"{'ID':<15} | {'Category':<22} | {'Rule':<6} | {'ML':<6} | {'Fused':<7} | {'Status':<10} | {'Assigned Cat':<22}")
print("-" * 115)

for s in scenarios:
    msg = s['prompt']
    res = clf.classify(msg)
    
    rule_flag = (res['rule_score'] >= threshold)
    ml_flag = (res['ml_score'] >= threshold)
    fused_flag = res['is_jailbreak']
    
    if ml_flag and not rule_flag:
        ml_alone_caught += 1
        tag = "ML_ONLY"
    elif rule_flag and not ml_flag:
        rule_alone_caught += 1
        tag = "RULE_ONLY"
    elif rule_flag and ml_flag:
        both_caught += 1
        tag = "BOTH"
    else:
        neither_caught += 1
        tag = "NEITHER (MISSED)"
        
    print(f"{s['id']:<15} | {s['category']:<22} | {res['rule_score']:<6.2f} | {res['ml_score']:<6.2f} | {str(fused_flag):<7} | {tag:<18} | {res['attack_type']:<22}")

print("=" * 115)
print(f"Caught by ML alone (Rule < {threshold}, ML >= {threshold}): {ml_alone_caught}")
print(f"Caught by Rule alone (Rule >= {threshold}, ML < {threshold}): {rule_alone_caught}")
print(f"Both caught (Rule >= {threshold}, ML >= {threshold}): {both_caught}")
print(f"Missed entirely (Rule < {threshold}, ML < {threshold}): {neither_caught}")
print(f"Novel Attack Recall at Balanced (0.60): {((ml_alone_caught + rule_alone_caught + both_caught) / len(scenarios)) * 100:.1f}%")
