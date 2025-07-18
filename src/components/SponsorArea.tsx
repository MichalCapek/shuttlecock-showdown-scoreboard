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
        <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 px-4 py-4">
            <span className="text-foreground font-medium text-sm sm:text-base">Partneři klubu:</span>
            <div className="flex items-center space-x-4 sm:space-x-6">
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
                            className="h-8 sm:h-12 w-auto object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SponsorArea;
