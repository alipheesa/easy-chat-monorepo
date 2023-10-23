import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "../../../../../../../../../../../../common/handlers/crop";
import {
  Dialog,
  DialogContent,
} from "../../../../../../../../../../../../modals/DefaultModal";
import CropModalButtons from "../CropModalButtons";

const WallpaperCropDialog = ({
  open,
  onOpenChange,
  imgSrc,
  setCroppedImageUrl,
  setCroppedImageBlob,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imgSrc: string;
  setCroppedImageUrl: (image: string) => void;
  setCroppedImageBlob: (image: Blob) => void;
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCancelClick = () => {
    onOpenChange(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onSaveClick = async () => {
    onCancelClick();
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      if (!croppedImage) return;
      setCroppedImageBlob(croppedImage);
      setCroppedImageUrl(URL.createObjectURL(croppedImage));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        onOpenChange(open);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      }}
    >
      <DialogContent zIndex={110}>
        <div
          className="flex flex-col w-[45vw] h-[90vh] bg-gray-700 rounded-[4px] 
                      overflow-hidden focus:outline-0"
        >
          <h1 className="text-gray-400 font-sans font-semibold text-xl mx-[2.5%] my-[3%]">
            Edit Image
          </h1>
          <div
            className="flex relative overflow-scroll w-[95%] h-[65%] px-[15%] 
                      bg-gray-900 rounded-[4px] self-center items-center justify-center"
          >
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={2}
              cropShape="rect"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropAreaChange={(croppedAreaPercentage, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
            />
          </div>
          <CropModalButtons
            onCancelClick={onCancelClick}
            onSaveClick={onSaveClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WallpaperCropDialog;
