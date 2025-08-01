import { useAuth } from "@/contexts/AuthContext";

const UserVerification = () => {
  const { user } = useAuth();

    return (<>
        {/* verify if user email is verified */}
        {user?.email_verified != null ? '' : (
            <div className='bg-emerald-200 p-2 rounded-md border-1 border-emerald-700 text-center'>
                <span className="text-emerald-500 font-bold text-m">Your User Has not Been Verified</span>
                <br />
                <span className="text-sm text-gray-800">Please contact support to finalize your subscription.</span>
            </div>
        )}.
    </>);
}

export default UserVerification;