import { Area } from "react-easy-crop";

const CropPreview = ({
  imgSrc,
  croppedArea,
  aspect = 1,
}: {
  imgSrc: string;
  croppedArea: Area;
  aspect?: number;
}) => {
  const scale = 100 / croppedArea.width;
  const transform = {
    x: `${-croppedArea.x * scale}%`,
    y: `${-croppedArea.y * scale}%`,
    scale,
    width: "calc(100% + 0.5px)",
    height: "auto",
  };

  const imageStyle = {
    transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
    width: transform.width,
    height: transform.height,
  };

  return (
    <div className="relative" style={{ paddingBottom: `${100 / aspect}%` }}>
      <img
        className="absolute top-0 left-0 origin-top-left"
        src={imgSrc}
        alt=""
        style={imageStyle}
      />
    </div>
  );
};

export default CropPreview;
