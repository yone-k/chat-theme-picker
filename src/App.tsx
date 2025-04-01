import ChatGacha from './components/ThemePicker';

function App() {
  // ウィンドウ幅を取得（実際のクライアント幅に基づく）
  const isDesktop = window.innerWidth >= 768;
  
  const containerStyles = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f97316, #e11d48, #ef4444)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isDesktop ? '2rem' : '1rem'
  };

  const innerContainerStyles = {
    maxWidth: isDesktop ? '56rem' : '36rem', // PC版は56rem（896px）に拡大
    width: '100%',
    margin: '0 auto'
  };

  return (
    <div style={containerStyles}>
      <div style={innerContainerStyles}>
        <ChatGacha />
      </div>
    </div>
  );
}

export default App;
