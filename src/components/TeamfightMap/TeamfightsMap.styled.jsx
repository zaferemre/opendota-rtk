import styled from "styled-components";

const MapWrapper = styled.div`
  position: relative;
  width: ${MAP_DISPLAY_SIZE}px;
  height: ${MAP_DISPLAY_SIZE}px;
  background-image: url(${MAP_IMAGE});
  background-size: cover;
  background-position: center;
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const Marker = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ff5733;
  border: 1.5px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 2;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  transform: translate(-50%, -120%);
  pointer-events: none;
`;

const Controls = styled.div`
  margin-bottom: 20px;
  color: #fff;
`;

const SliderGroup = styled.div`
  margin-bottom: 10px;
`;

const Slider = styled.input`
  width: 100%;
`;
