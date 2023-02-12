import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { setRenamingItem } from "./taskPanelSlice";

interface ButtonRenameProps {
  itemKey: string;
  level: string;
}

export const ButtonRename: React.FC<ButtonRenameProps> = (
  props
) => {
  const { itemKey, level } = props;
  const renamingItem = useAppSelector(
    (s) => s.taskPanel.renamingItem
  );
  const dispatch = useAppDispatch();
  const clickHandler: React.MouseEventHandler = (e) => {
    if (itemKey !== renamingItem) {
      dispatch(setRenamingItem(itemKey));
    }
  };

  if (itemKey !== renamingItem)
    return (
      <Button
        onClick={clickHandler}
        title={`rename ${level}`}
        size="small"
        type="text"
      >
        {itemKey !== renamingItem && (
          <EditOutlined label="rename" />
        )}
      </Button>
    );

  return null;
};
