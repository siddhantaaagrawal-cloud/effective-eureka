import FriendCard from '../FriendCard';
import avatar1 from '@assets/generated_images/Female_profile_avatar_friendly_45946ac8.png';
import avatar2 from '@assets/generated_images/Male_profile_avatar_professional_8445cdd2.png';
import avatar3 from '@assets/generated_images/Profile_avatar_with_glasses_1fb5674b.png';

export default function FriendCardExample() {
  return (
    <div className="flex gap-4 p-6 bg-background overflow-x-auto">
      <FriendCard name="Emma Wilson" avatar={avatar1} focusScore={85} trend="up" />
      <FriendCard name="James Chen" avatar={avatar2} focusScore={78} trend="down" />
      <FriendCard name="Alex Morgan" avatar={avatar3} focusScore={92} trend="up" />
    </div>
  );
}
