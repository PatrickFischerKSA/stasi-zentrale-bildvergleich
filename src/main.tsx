import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import Index from './routes/index';
import './styles.css';
createRoot(document.getElementById('root')!).render(<><Index/><Toaster richColors/></>);
