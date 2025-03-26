import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
`;

export const Card = styled.div`
  background: #2a2a2a;
  border-radius: 10px;
  padding: 14px 12px;
  width: 200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  border: 2px solid transparent;
  color: #f0f0f0;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.6);
  }

  &.highlight {
    border-color: #efbf04;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 12px rgba(239, 191, 4, 0.5);
  }
`;

export const HeroRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

export const DeltaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #dcdcdc;
  margin-top: 6px;
`;

export const TimeLabel = styled.div`
  font-size: 0.7rem;
  color: #aaa;
  margin-bottom: 4px;
`;

export const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
