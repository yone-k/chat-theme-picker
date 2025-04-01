import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import LoadingSpinner from './LoadingSpinner';

type Theme = {
  ジャンル: string;
  テーマ: string;
};

const ChatGacha = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [displayedTheme, setDisplayedTheme] = useState<Theme | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  
  const spinInterval = useRef<number | null>(null);
  const spinSpeed = 80; // ミリ秒

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./themes.csv');
        const csvText = await response.text();
        
        Papa.parse<Theme>(csvText, {
          header: true,
          complete: (results) => {
            const validThemes = results.data.filter(theme => theme.ジャンル && theme.テーマ);
            setThemes(validThemes);
            setIsLoading(false);
          },
          error: (error: Error) => {
            setError(`CSVパース中にエラーが発生しました: ${error.message}`);
            setIsLoading(false);
          }
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '不明なエラー';
        setError(`テーマの読み込み中にエラーが発生しました: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    fetchThemes();
    
    // ウィンドウのリサイズを監視
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // クリーンアップ関数
    return () => {
      if (spinInterval.current !== null) {
        window.clearInterval(spinInterval.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleGacha = () => {
    if (isSpinning) {
      // ストップ処理
      if (spinInterval.current !== null) {
        window.clearInterval(spinInterval.current);
        spinInterval.current = null;
      }
      
      setIsSpinning(false);
      setSelectedTheme(displayedTheme);
    } else {
      // スタート処理
      if (themes.length === 0) return;
      
      setIsSpinning(true);
      setHasStarted(true);
      setSelectedTheme(null);
      
      // 初回スタート時はランダムテーマをセット
      const randomIndex = Math.floor(Math.random() * themes.length);
      setDisplayedTheme(themes[randomIndex]);
      
      // インターバルでテーマをランダム表示
      spinInterval.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * themes.length);
        setDisplayedTheme(themes[randomIndex]);
      }, spinSpeed);
    }
  };

  // レスポンシブデザイン対応
  const isDesktop = windowWidth >= 768;

  // テーマの文字数に応じてフォントサイズを調整する関数
  const getThemeFontSize = (theme: string | undefined): string => {
    if (!theme) return isDesktop ? '2.25rem' : '1.875rem';
    
    if (theme.length <= 15) {
      return isDesktop ? '2.5rem' : '2rem';
    } else if (theme.length <= 25) {
      return isDesktop ? '2.25rem' : '1.75rem';
    } else if (theme.length <= 35) {
      return isDesktop ? '2rem' : '1.5rem';
    } else {
      return isDesktop ? '1.75rem' : '1.25rem';
    }
  };

  const mainStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isDesktop ? '3rem' : '1.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderTop: '8px solid #f97316',
    width: '100%'
  };

  const titleStyles = {
    fontSize: isDesktop ? '3.5rem' : '2.25rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    textAlign: 'center' as const,
    color: '#7c2d12',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
  };

  const cardContainerStyles = {
    width: '100%',
    maxWidth: isDesktop ? '48rem' : '28rem',  // PC版は48rem（768px）に拡大
    marginBottom: '3rem'
  };

  const buttonStyles = {
    padding: isDesktop ? '1.5rem 5rem' : '1.25rem 3rem',
    borderRadius: '9999px',
    fontWeight: 'bold',
    fontSize: isDesktop ? '1.75rem' : '1.25rem',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    backgroundColor: isSpinning ? '#dc2626' : '#f97316',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    transform: 'translateY(0)'
  };

  const messageStyles = {
    marginTop: '2.5rem',
    padding: '1.25rem',
    borderRadius: '0.5rem',
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    width: '100%',
    maxWidth: isDesktop ? '48rem' : '28rem'  // PC版は48rem（768px）に拡大
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        padding: '1.5rem'
      }}>
        <LoadingSpinner />
        <div style={{
          fontSize: '1.25rem',
          color: '#92400e',
          marginTop: '1rem'
        }}>データを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        padding: '1.5rem'
      }}>
        <div style={{
          fontSize: '1.25rem',
          color: '#b91c1c'
        }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={mainStyles}>
      <h1 style={titleStyles}>雑談ガチャ</h1>

      <div style={cardContainerStyles}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          border: isSpinning 
            ? '4px solid #fb923c'
            : selectedTheme 
              ? '4px solid #f59e0b'
              : '1px solid #fed7aa',
          backgroundColor: isSpinning ? '#fff7ed' : 'white',
          height: '240px', // 固定高さに設定
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {hasStarted && displayedTheme ? (
            <div style={{
              padding: isDesktop ? '3rem' : '2rem',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p style={{
                fontSize: getThemeFontSize(displayedTheme.テーマ),
                fontWeight: 'bold',
                color: '#9a3412',
                textAlign: 'center',
                lineHeight: '1.4',
                maxHeight: '100%',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,  // 最大4行まで表示
                WebkitBoxOrient: 'vertical' as const
              }}>
                {displayedTheme.テーマ}
              </p>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              width: '100%',
              textAlign: 'center',
              color: '#9a3412'
            }}>
              スタートを押してテーマを選ぶ
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleGacha}
        style={buttonStyles}
        onMouseOver={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'translateY(-4px)';
          target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseOut={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}
      >
        {isSpinning ? 'ストップ' : 'スタート'}
      </button>

      {selectedTheme && (
        <div style={messageStyles}>
          <p style={{
            fontSize: isDesktop ? '1.5rem' : '1.125rem',
            fontWeight: '500',
            color: '#92400e',
            textAlign: 'center'
          }}>
            このテーマについて話し合ってみましょう！
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatGacha; 