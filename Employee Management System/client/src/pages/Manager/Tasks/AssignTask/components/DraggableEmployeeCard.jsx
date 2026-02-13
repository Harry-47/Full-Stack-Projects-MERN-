import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import UserCard from "../../../../../components/UserCard";

const DraggableEmployeeCard = ({ user }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: user._id,
    data: user, // pass whole user data
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
    zIndex: transform ? 100 : 1, // during drag, card will show on top of the content
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {/* User Card component */}
      <UserCard user={user} isDeleteAllowed={false} />
    </div>
  );
};

export default DraggableEmployeeCard;