import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { customerApi } from "../services/api";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const selectedAccount = profile?.accounts?.[0] ?? null;

  const applicationStatus = selectedAccount?.requestStatus?.toUpperCase() || profile?.requestStatus?.toUpperCase() || "PENDING";

  const accountStatus = selectedAccount?.accountStatus?.toUpperCase() || "PENDING";

  const displayedAccountNumber = selectedAccount?.accountNumber || profile?.accountNumber || "--";
  const displayedAccountType = selectedAccount?.accountType || profile?.accountType || "--";
  const displayedBalance = selectedAccount?.balance ?? profile?.balance ?? 0;
  const displayedBankName = selectedAccount?.bank?.bankName || selectedAccount?.bankName || profile?.bankName || "--";
  const displayedIfscCode = selectedAccount?.bank?.ifscCode || selectedAccount?.ifscCode || profile?.ifscCode || "--";

  const [formData, setFormData] = useState({
    customerId: 0,
    customerName: "",
    email: "",
    mobileNumber: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const savedBankId = Number(localStorage.getItem('selectedBankId') || '1');
      const data = await customerApi.getProfile(user!.userId, savedBankId);

      const selectedAccountFromPayload = data?.accounts?.[0];
      const resolvedBankId = selectedAccountFromPayload?.bank?.bankId || selectedAccountFromPayload?.bankId || savedBankId || 1;
      localStorage.setItem('selectedBankId', String(resolvedBankId));

      setProfile(data);

      setFormData({
        customerId: data.customerId,
        customerName: data.customerName || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        address: data.address || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const handleUpdate = async () => {
  // Name validation
  if (formData.customerName.trim() === "") {
    alert("Customer name is required.");
    return;
  }

  if (!/^[A-Za-z ]+$/.test(formData.customerName)) {
    alert("Customer name should contain only letters.");
    return;
  }

  // Mobile validation
  if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
    alert("Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9.");
    return;
  }

  // Address validation
  if (formData.address.trim() === "") {
    alert("Address is required.");
    return;
  }

  try {
    const msg = await customerApi.updateProfile(formData);
    alert(msg);
    setEditing(false);
    loadProfile();
  } catch (err: any) {
    alert(err.message);
  }
};

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label>Name</label>

            <input
              className="border rounded w-full p-2 mt-1"
              disabled={!editing}
              value={formData.customerName}
              onChange={(e)=>
                setFormData({...formData,
                customerName:e.target.value})
              }
            />
          </div>

          <div>
            <label>Email</label>

            <input
              className="border rounded w-full p-2 mt-1"
              disabled
              value={formData.email}
            />
          </div>

          <div>
            <label>Mobile</label>

           <input
  type="text"
  className="border rounded w-full p-2 mt-1"
  disabled={!editing}
  value={formData.mobileNumber}
  maxLength={10}
  onChange={(e) =>
    setFormData({
      ...formData,
      mobileNumber: e.target.value.replace(/\D/g, ""),
    })
  }
/>
          </div>

          <div>
            <label>Address</label>

            <input
              className="border rounded w-full p-2 mt-1"
              disabled={!editing}
              value={formData.address}
              onChange={(e)=>
                setFormData({...formData,
                address:e.target.value})
              }
            />
          </div>

          <div>
            <label>Application Status</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={applicationStatus}
            />
          </div>

          <div>
            <label>Account Status</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={accountStatus}
            />
          </div>

          <div>
            <label>Account Number</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={displayedAccountNumber}
            />
          </div>

          <div>
            <label>Account Type</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={displayedAccountType}
            />
          </div>

          <div>
            <label>Balance</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={displayedBalance}
            />
          </div>

          <div>
            <label>Bank</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={displayedBankName}
            />
          </div>

          <div>
            <label>IFSC Code</label>
            <input
              className="border rounded w-full p-2 mt-1 bg-gray-100"
              disabled
              value={displayedIfscCode}
            />
          </div>

        </div>

        <div className="mt-8 flex gap-4">

          {!editing ? (
            <button
              onClick={()=>setEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Update
              </button>

              <button
                onClick={()=>setEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

