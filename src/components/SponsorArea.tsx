import React, { useState, useEffect } from 'react';
import benatkyLogo from '../../assets/benatky_logo.gif';
import CRProjectLogo from '../../assets/CR_Project_logo_new.png';
import victorLogo from '../../assets/victor-logo.png';


const SponsorArea: React.FC = () => {
    const [currentSponsor, setCurrentSponsor] = useState(0);

    const sponsors = [
        { name: "Město Benátky", logo: benatkyLogo },
        { name: "Victor", logo: victorLogo },
        { name: "CR Project", logo: CRProjectLogo },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [sponsors.length]);

    return (
        <div className="h-full flex items-center justify-center bg-background py-4 px-6">
            <div className="flex items-center space-x-6">
                <span className="text-foreground font-medium text-sm">Partneři klubu:</span>

                {sponsors.map((sponsor, index) => (
                    <div
                        key={sponsor.name}
                        className={`transition-all duration-500 ${
                            index === currentSponsor ? 'opacity-100 scale-105' : 'opacity-30 scale-100'
                        }`}
                    >
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SponsorArea;
