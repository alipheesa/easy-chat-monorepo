const CropModalButtons = ({
  onCancelClick,
  onSaveClick,
}: {
  onCancelClick: () => void;
  onSaveClick: () => void;
}) => {
  return (
    <div className="flex flex-row justify-center mt-auto mb-[3%] mr-[3%] shrink-0">
      <button
        className="hover:underline text-white mr-4 font-sans"
        onClick={onCancelClick}
      >
        Cancel
      </button>
      <button
        className="px-3 py-2 bg-emerald-600 hover:opacity-80 text-white shrink-0
                    font-sans rounded-[4px] transition ease-out duration-250 shadow-md"
        onClick={onSaveClick}
      >
        Save Changes
      </button>
    </div>
  );
};

export default CropModalButtons;
