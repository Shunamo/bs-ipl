import pandas as pd
import os
import json

# 디렉토리 생성
os.makedirs('public/data/split', exist_ok=True)

# CSV 파일 읽기
df = pd.read_csv('../../public/data/combined_interaction_detail.csv', low_memory=False)

# PDB ID 기준으로 그룹화
pdb_ids = sorted(df['pdb_id'].unique().tolist())
print(f"고유 PDB ID 개수: {len(pdb_ids)}")

# PDB ID 리스트 저장
with open('public/data/pdb_list.json', 'w') as f:
    json.dump(pdb_ids, f)

# 3개의 파일로 분할
chunk_size = len(pdb_ids) // 3
if len(pdb_ids) % 3 > 0:
    chunk_size += 1

for i in range(3):
    start_idx = i * chunk_size
    end_idx = min((i + 1) * chunk_size, len(pdb_ids))
    chunk_pdb_ids = pdb_ids[start_idx:end_idx]
    
    # 해당 그룹의 PDB ID에 해당하는 데이터만 필터링
    chunk_df = df[df['pdb_id'].isin(chunk_pdb_ids)]
    
    # 파일 저장
    output_file = f'public/data/split/data_part_{i+1}.csv'
    chunk_df.to_csv(output_file, index=False)
    print(f"파트 {i+1}: {len(chunk_pdb_ids)}개 PDB ID, {len(chunk_df)}행 - {output_file}에 저장됨")

print("완료!")