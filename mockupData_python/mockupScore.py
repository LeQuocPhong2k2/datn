import random

def generate_vietnamese_scores(num_students=40):
    scores = []
    for _ in range(num_students):
        gk = round(random.uniform(5, 10), 1)  # Điểm giữa kỳ
        ck = round(random.uniform(0, 10), 1)  # Điểm cuối kỳ
        tb_hk1 = round((gk * 2 + ck * 3) / 5, 1)  # Điểm trung bình học kỳ 1
        
        scores.append(gk)
    return scores

# Tạo danh sách 40 điểm cho môn Tiếng Việt lớp 1
vietnamese_scores = generate_vietnamese_scores()
for idx, score in enumerate(vietnamese_scores, 1):
    print(score)