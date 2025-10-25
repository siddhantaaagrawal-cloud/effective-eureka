import LeaderboardItem from '../LeaderboardItem';
import avatar1 from '@assets/generated_images/Female_profile_avatar_friendly_45946ac8.png';
import avatar2 from '@assets/generated_images/Male_profile_avatar_professional_8445cdd2.png';
import avatar3 from '@assets/generated_images/Profile_avatar_with_glasses_1fb5674b.png';

export default function LeaderboardItemExample() {
  return (
    <div className="flex flex-col gap-2 p-6 bg-background max-w-md">
      <LeaderboardItem rank={1} name="Alex Morgan" avatar={avatar3} score={92} trend="up" trendValue={5} />
      <LeaderboardItem rank={2} name="Emma Wilson" avatar={avatar1} score={85} trend="up" trendValue={3} />
      <LeaderboardItem rank={3} name="James Chen" avatar={avatar2} score={78} isCurrentUser trend="down" trendValue={2} />
      <LeaderboardItem rank={4} name="Sarah Lee" avatar={avatar1} score={72} />
    </div>
  );
}
