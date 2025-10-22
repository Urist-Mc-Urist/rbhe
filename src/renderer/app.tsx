import * as React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    const [greeting, setGreeting] = React.useState('Loading...');

    React.useEffect(() => {
        const fetchGreeting = async () => {
            const result = await window.electronAPI.getGreeting('React User');
            setGreeting(result);
        }

        fetchGreeting();
    }, []);

    return <h2>{greeting}</h2>
}


const root = createRoot(document.body);
root.render(<App />);