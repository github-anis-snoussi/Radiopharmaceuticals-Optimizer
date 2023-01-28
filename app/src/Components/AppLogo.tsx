const AppLogo = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
      }}
    >
      <img src={'logo-filled-white.png'} style={{ height: 60, aspectRatio: 1 }} alt="app-logo" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 0,
          margin: 0,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            padding: 0,
            margin: 0,
            height: 20,
          }}
        >
          RP
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            padding: 0,
            margin: 0,
            height: 20,
            marginBottom: 15,
          }}
        >
          Optimizer
        </span>
      </div>
    </div>
  );
};

export default AppLogo;
