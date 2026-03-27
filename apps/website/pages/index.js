import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const SHEET_CONFIG = {
  profile: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcUDA9Y3c70dZcVHxAS-o51kCMktANMV31Y7pYFfvnhZfDejfntqIZEKmWA7fKPefrEKChGH9MLOj2/pub?gid=0&single=true&output=csv",
  gallery: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcUDA9Y3c70dZcVHxAS-o51kCMktANMV31Y7pYFfvnhZfDejfntqIZEKmWA7fKPefrEKChGH9MLOj2/pub?gid=925424429&single=true&output=csv"
};

export default function KayaFanSite() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(SHEET_CONFIG[activeTab]);
        const csvText = await response.text();
        const Papa = (await import('papaparse')).default;
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            setData(res.data);
            setLoading(false);
          }
        });
      } catch (e) {
        console.error(error);
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  return (
    <div className="site-root">
      <Head>
        <title>Kaya_System | Fan Archive</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Montserrat:wght@400;800&family=JetBrains+Mono:wght@800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <header className="site-header">
        <div className="header-content">
          <h1 className="logo">Kaya_System<span>.web</span></h1>
          <div className="tab-nav">
            <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>GALLERY</button>
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>PROFILE</button>
          </div>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div className="loader"><i className="fas fa-spinner fa-spin"></i> LOADING_DATA...</div>
        ) : (
          <>
            {activeTab === 'gallery' ? (
              <div className="gallery-grid">
                {data.map((item, i) => (
                  <div key={i} className="photo-card">
                    <div className="card-image-wrapper">
                      <img src={item.image || item.link || item.画像} alt="" loading="lazy" />
                    </div>
                    <div className="card-info">
                      <span className="card-date">{item.日付 || item.date}</span>
                      <span className="card-name">{item.キャラクター || item.名前 || 'Kaya'}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="link-icon">
                          <i className="fab fa-x-twitter"></i>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-section">
                <div className="glass-panel">
                  <h2 className="panel-title">MEMBER_DATA</h2>
                  <table className="profile-table">
                    <thead>
                      <tr>
                        {data.length > 0 && Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((val, j) => (
                            <td key={j}>
                              {String(val).startsWith('http') ? 
                                <a href={val} target="_blank" rel="noreferrer" className="table-link">LINK <i className="fas fa-external-link-alt"></i></a> 
                                : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        :root {
          --bg-color: #050507;
          --accent-color: #00f2ff;
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        body {
          margin: 0;
          background: var(--bg-color);
          color: white;
          font-family: 'Montserrat', sans-serif;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(0, 242, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(0, 242, 255, 0.08) 0%, transparent 50%);
          background-attachment: fixed;
        }

        .site-header {
          padding: 20px 40px;
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(5, 5, 7, 0.8);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo { font-family: 'Playfair Display', serif; font-style: italic; font-size: 24px; margin: 0; }
        .logo span { font-family: 'JetBrains Mono'; font-size: 12px; color: var(--accent-color); margin-left: 5px; }

        .tab-nav { display: flex; gap: 10px; }
        .tab-nav button {
          background: none; border: 1px solid transparent; color: #666;
          font-family: 'JetBrains Mono'; font-weight: 800; padding: 8px 16px;
          cursor: pointer; transition: 0.3s; border-radius: 4px;
        }
        .tab-nav button.active { color: var(--accent-color); border-color: var(--accent-color); background: rgba(0, 242, 255, 0.05); }

        .container { max-width: 1400px; margin: 0 auto; padding: 40px 20px; min-height: 80vh; }

        /* Gallery Grid */
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        .photo-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; transition: 0.4s; }
        .photo-card:hover { transform: translateY(-8px); border-color: var(--accent-color); box-shadow: 0 10px 40px rgba(0, 242, 255, 0.15); }
        .card-image-wrapper { aspect-ratio: 1; overflow: hidden; background: #111; }
        .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .card-info { padding: 15px; position: relative; }
        .card-date { display: block; font-family: 'JetBrains Mono'; font-size: 10px; color: #555; margin-bottom: 5px; }
        .card-name { font-weight: 800; font-size: 14px; letter-spacing: 1px; }
        .link-icon { position: absolute; right: 15px; bottom: 15px; color: #444; font-size: 18px; transition: 0.3s; }
        .link-icon:hover { color: var(--accent-color); }

        /* Profile Table */
        .glass-panel { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px); }
        .panel-title { font-family: 'JetBrains Mono'; font-size: 18px; color: var(--accent-color); margin-bottom: 20px; }
        .profile-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .profile-table th { text-align: left; padding: 15px; border-bottom: 1px solid #222; color: #666; font-family: 'JetBrains Mono'; }
        .profile-table td { padding: 15px; border-bottom: 1px solid #111; color: #ccc; }
        .table-link { color: var(--accent-color); text-decoration: none; font-weight: 800; font-size: 11px; }

        .loader { text-align: center; padding: 100px; font-family: 'JetBrains Mono'; color: var(--accent-color); font-size: 20px; }
      `}</style>
    </div>
  );
}
