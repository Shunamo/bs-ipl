'use client';

import { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone/esm/vis-network';
import type { Node, Edge } from 'vis-network';
import { CsvRow } from '@/types/csv';

interface GraphCanvasProps {
  data: CsvRow[];
  pdb: string;
  protein: string;
  peptide: string;
}

export default function GraphCanvas({ data, pdb, protein, peptide }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pdb || !protein || !peptide) return;

    const filtered = data.filter(
      (row) =>
        row.pdb_id === pdb &&
        row.protein_chain === protein &&
        row.peptide_chain === peptide
    );

    const nodesSet = new Set<string>();
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorMap: Record<string, string> = {
      HBOND: '#1f77b4',
      IONIC: '#ff7f0e',
      HYDROPHOBIC: '#2ca02c',
      PIPISTACK: '#d62728',
      PICATION: '#9467bd',
      SSBOND: '#8c564b',
      HALOGEN: '#e377c2',
      METALLIC: '#7f7f7f',
      PIHBOBD: '#bcbd22',
    };

    for (const row of filtered) {
      const [res1, res2] = row.residue_list.split(' ');
      const label = row.interaction_type.split(':')[0];
      const color = colorMap[label.toUpperCase()] || '#999999';

      if (res1 && !nodesSet.has(res1)) {
        nodes.push({ id: res1, label: res1, color: '#9fbbf8' });
        nodesSet.add(res1);
      }
      if (res2 && !nodesSet.has(res2)) {
        nodes.push({ id: res2, label: res2, color: '#a9f9b9' });
        nodesSet.add(res2);
      }

      edges.push({ from: res1, to: res2, label, color });
    }

    const dataSet = {
      nodes: new DataSet<Node>(nodes),
      edges: new DataSet<Edge>(edges),
    };

    const options = {
      nodes: {
        shape: 'dot',
        scaling: { min: 10, max: 30 },
        font: { size: 12, face: 'Tahoma' },
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'continuous',
          forceDirection: 'none',
          roundness: 0.5,
        },
        color: { inherit: false },
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 95,
        },
        minVelocity: 0.75,
      },
      interaction: {
        navigationButtons: true,  // 확대/축소, 이동 버튼 활성화
        keyboard: true,
        
      },
    };

    new Network(containerRef.current, dataSet, options);
  }, [data, pdb, protein, peptide]);

  return <div ref={containerRef} style={{ borderRadius: '5px', border: '1px solid #d0d0d0', height: '700px', width: '80%' }} />;
}
