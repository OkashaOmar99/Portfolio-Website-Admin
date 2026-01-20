import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const GlobalTitle = () => {
    const { getSetting } = useSiteSettings();
    const siteTitle = getSetting('site_title');

    useEffect(() => {
        if (siteTitle) {
            document.title = siteTitle;
        }
    }, [siteTitle]);

    return null;
};

export default GlobalTitle;
