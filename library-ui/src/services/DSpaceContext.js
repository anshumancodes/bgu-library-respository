// Create DSpace context
const DSpaceContext = createContext();

// DSpace Provider Component
export const DSpaceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const authStatus = await dspaceApi.getAuthStatus();
      if (authStatus && authStatus.authenticated) {
        setUser(authStatus);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dspaceApi.login(email, password);
      const authStatus = await dspaceApi.getAuthStatus();
      setUser(authStatus);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await dspaceApi.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
  };

  return (
    <DSpaceContext.Provider value={value}>
      {children}
    </DSpaceContext.Provider>
  );
};

// Custom hook to use DSpace context
export const useDSpace = () => {
  const context = useContext(DSpaceContext);
  if (!context) {
    throw new Error('useDSpace must be used within a DSpaceProvider');
  }
  return context;
};

// Custom hook for fetching data with loading states
export const useDSpaceData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for communities
export const useCommunities = (page = 0, size = 20) => {
  return useDSpaceData(
    () => dspaceApi.getCommunities(page, size),
    [page, size]
  );
};

// Custom hook for collections
export const useCollections = (page = 0, size = 20) => {
  return useDSpaceData(
    () => dspaceApi.getCollections(page, size),
    [page, size]
  );
};

// Custom hook for items
export const useItems = (page = 0, size = 20) => {
  return useDSpaceData(
    () => dspaceApi.getItems(page, size),
    [page, size]
  );
};

// Custom hook for search
export const useSearch = (query, filters = {}, page = 0, size = 20) => {
  return useDSpaceData(
    () => query ? dspaceApi.search(query, filters, page, size) : Promise.resolve(null),
    [query, JSON.stringify(filters), page, size]
  );
};

// Custom hook for a single item
export const useItem = (uuid) => {
  return useDSpaceData(
    () => uuid ? dspaceApi.getItem(uuid) : Promise.resolve(null),
    [uuid]
  );
};

// Custom hook for item metadata
export const useItemMetadata = (uuid) => {
  return useDSpaceData(
    () => uuid ? dspaceApi.getItemMetadata(uuid) : Promise.resolve(null),
    [uuid]
  );
};

export default DSpaceContext;