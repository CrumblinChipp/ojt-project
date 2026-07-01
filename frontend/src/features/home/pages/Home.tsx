import { useAuth } from "../../../hooks/useAuth";


export default function Home() {
    const { user, loading } = useAuth();
    
    // Track the active action: null, 'add', or 'pull-out'

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
            
            <div className="mb-6 space-y-2">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Organization:</strong> {user?.organization}</p>
                <p><strong>Role:</strong> {user?.is_admin ? "Admin" : "Staff"}</p>
            </div>

            {/* Set the state based on the specific button clicked */}

            <button>
                <a href="/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ml-2">
                    Product List
                </a>
            </button>


            {/* Conditionally render if activeAction is not null */}
        </div>
    );
}