import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
from detector.classifier import JailbreakClassifier
from detector.config import DetectorConfig

clf = JailbreakClassifier(DetectorConfig(risk_level='balanced'))
threshold = clf.config.current_threshold

with open('data/test_scenarios.json', 'r', encoding='utf-8') as f:
    scenarios = json.load(f)

print(f"Threshold: {threshold}")
print(f"Total scenarios: {len(scenarios)}")

ml_alone_decisive = 0
rule_alone_decisive = 0
both_caught = 0
neither_caught = 0

print("-" * 105)
print(f"{'ID':<16} | {'Actual':<7} | {'Fused':<7} | {'Rule':<6} | {'ML':<6} | {'Status':<10} | {'Category':<24} | {'Matches':<8}")
print("-" * 105)

for s in scenarios:
    msg = s['input_payload'].get('message', '')
    meta = s['input_payload'].get('metadata', {})
    res = clf.classify(msg, metadata=meta)
    
    rule_flag = (res['rule_score'] >= threshold)
    ml_flag = (res['ml_score'] >= threshold)
    fused_flag = res['is_jailbreak']
    actual = s['is_jailbreak']
    
    if ml_flag and not rule_flag:
        ml_alone_decisive += 1
        tag = "ML_ONLY"
    elif rule_flag and not ml_flag:
        rule_alone_decisive += 1
        tag = "RULE_ONLY"
    elif rule_flag and ml_flag:
        both_caught += 1
        tag = "BOTH"
    else:
        neither_caught += 1
        tag = "NEITHER"
        
    print(f"{s['scenario_id']:<16} | {str(actual):<7} | {str(fused_flag):<7} | {res['rule_score']:<6.2f} | {res['ml_score']:<6.2f} | {tag:<10} | {res['attack_type']:<24} | {len(res['matched_rules'])}")

print("=" * 105)
print(f"ML alone caught (Rule < {threshold}, ML >= {threshold}): {ml_alone_decisive}")
print(f"Rule alone caught (Rule >= {threshold}, ML < {threshold}): {rule_alone_decisive}")
print(f"Both caught (Rule >= {threshold}, ML >= {threshold}): {both_caught}")
print(f"Neither caught (Rule < {threshold}, ML < {threshold}): {neither_caught}")
