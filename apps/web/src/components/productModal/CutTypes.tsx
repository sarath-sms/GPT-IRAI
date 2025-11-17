import React from 'react'
import styled from 'styled-components';

const Section = styled.div`
  margin-top: 12px;
`;
const CutList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const CutCard = styled.button<{ active?: boolean }>`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: ${({ active }) => (active ? "rgba(255,235,59,0.12)" : "transparent")};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

export default function CutTypes({product, cutType, setCutType}: any) {
  return (
    <Section>
              <strong>Cut type</strong>
              <CutList style={{ marginTop: 8 }}>
                {product.cutTypes.map((cut: any) => (
                  <CutCard
                    key={cut.type}
                    active={cutType?.type === cut.type}
                    onClick={() => setCutType(cut)}
                  >
                    {cut.type} {cut.price ? `(+₹${cut.price})` : ""}
                  </CutCard>
                ))}
              </CutList>
            </Section>
  )
}
