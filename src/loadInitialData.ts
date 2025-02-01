import queryClient from "./queryClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialData = (window as any).__INITIAL_DATA__;

if (initialData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData.forEach((data: any) => {
        queryClient.setQueryData(data.key, data.value);
    });    
}
