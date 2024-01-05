import FileEncodingDetectorComponent from "@/app/tools/file-encoding-detector/FileEncodingDetectorComponent";
import {getUserAndSubscriptionState} from "@/actions/user";

const FileEncodingDetector = async () => {
    const {user, isProUser} = await getUserAndSubscriptionState();
    return <FileEncodingDetectorComponent user={user} isProUser={isProUser}/>;
};
export default FileEncodingDetector;
