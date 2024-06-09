import { useOthers, useSelf } from "@/liveblocks.config";
import { Avatar } from "./Avatar";
import styles from "./ActiveUsers.module.css";
import { generateRandomName } from "@/lib/utils";
import { useMemo } from "react";

export default function ActiveUsers() {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  const memorizedUsers = useMemo(() => {
    return (
      <div className="flex items-center justify-center gap-1 py-2">
        <div className="flex pl-3">
          {currentUser && (
            <Avatar name="You" otherStyles="border-[3px] border-primary-green" />
          )}
          {users.slice(0, 3).map(({ connectionId, info }) => {
            return (
              <Avatar otherStyles="-ml-3" key={connectionId} name={generateRandomName()} />
            );
          })}

          {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
        </div>
      </div>
    );
  }, [users.length]);

  return memorizedUsers
}