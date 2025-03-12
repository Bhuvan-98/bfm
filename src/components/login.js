'use client';

import { useState } from 'react';

function Login() {
  const [info, setInfo] = useState(null);

  // ✅ Get Device Type
  const getDeviceType = () => {
    const ua = navigator.userAgent || 'Unknown';
    const platform = navigator.platform || 'Unknown';
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const hasMouse = window.matchMedia('(pointer:fine)').matches;
    const isTouchScreen = window.matchMedia('(pointer:coarse)').matches;

    // Mobile
    if (/Mobi|Android/i.test(ua)) return 'Mobile';

    // Tablet
    if (
      /Tablet|iPad/i.test(ua) || 
      (maxTouchPoints > 1 && !/Mobi/i.test(ua) && !hasMouse)
    ) {
      return 'Tablet';
    }

    // Laptop
    if (hasMouse && maxTouchPoints > 0) return 'Laptop';

    // Desktop
    if (hasMouse && window.screen.width > 1440) return 'Desktop';

    return 'Unknown';
  };

  // ✅ Get OS Information
  const getOSInfo = () => {
    const platform = navigator.platform || 'Unknown';
    const userAgent = navigator.userAgent || 'Unknown';

    if (platform.includes('Win')) return 'Windows';
    if (platform.includes('Mac')) return 'macOS';
    if (platform.includes('Linux')) return 'Linux';
    if (/Android/.test(userAgent)) return 'Android';
    if (/like Mac OS X/.test(userAgent)) return 'iOS';

    return 'Unknown';
  };

  // ✅ Get Browser Information
  const getBrowserInfo = () => {
    const ua = navigator.userAgent || 'Unknown';

    if (/Edg/.test(ua)) return { name: 'Edge', version: ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown' };
    if (/Chrome/.test(ua)) return { name: 'Chrome', version: ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown' };
    if (/Firefox/.test(ua)) return { name: 'Firefox', version: ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown' };
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return { name: 'Safari', version: ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown' };

    return { name: 'Unknown', version: 'Unknown' };
  };

  // ✅ Get Network Information
  const getNetworkInfo = () => {
    if (navigator.connection) {
      const { effectiveType, downlink } = navigator.connection;

      let connectionSpeed = 'Unknown';
      let connectionType = downlink > 1 ? 'WiFi' : 'Mobile Data';

      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          connectionSpeed = '2G';
          break;
        case '3g':
          connectionSpeed = '3G';
          break;
        case '4g':
          connectionSpeed = downlink > 1 ? '5G' : '4G';
          break;
        default:
          connectionSpeed = 'Unknown';
      }

      return `${connectionType} (${connectionSpeed})`;
    }

    return 'Unknown';
  };

  // ✅ Get Public IP
  const getPublicIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip || 'Unknown';
    } catch {
      return 'Failed to fetch';
    }
  };

  // ✅ Get Location
  const getLocation = () =>
    new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: `${position.coords.accuracy} meters`,
            });
          },
          () => resolve('Location permission denied')
        );
      } else {
        resolve('Geolocation not supported');
      }
    });

  // ✅ Collect All Data
  const getInfo = async () => {
    const deviceType = getDeviceType();
    const os = getOSInfo();
    const browser = getBrowserInfo();
    const screenResolution = `${window.screen.width} x ${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const localTime = new Date().toLocaleString();
    const publicIp = await getPublicIP();
    const networkType = getNetworkInfo();
    const loginTimestamp = new Date().toISOString();
    const sessionId = `session_${Math.random().toString(36).substring(2)}`;
    const location = await getLocation();

    setInfo({
      deviceType,
      os,
      browserName: browser.name,
      browserVersion: browser.version,
      screenResolution,
      timezone,
      localTime,
      publicIp,
      networkType,
      loginTimestamp,
      sessionId,
      location,
    });
  };

  return (
    <div>
      <button onClick={getInfo} style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}>
        Submit
      </button>

      {info && (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr><th>Device Type</th><td>{info.deviceType}</td></tr>
            <tr><th>Operating System</th><td>{info.os}</td></tr>
            <tr><th>Browser</th><td>{info.browserName} {info.browserVersion}</td></tr>
            <tr><th>Screen Resolution</th><td>{info.screenResolution}</td></tr>
            <tr><th>Timezone</th><td>{info.timezone}</td></tr>
            <tr><th>Local Time</th><td>{info.localTime}</td></tr>
            <tr><th>Public IP</th><td>{info.publicIp}</td></tr>
            <tr><th>Network Type</th><td>{info.networkType}</td></tr>
            <tr><th>Login Timestamp</th><td>{info.loginTimestamp}</td></tr>
            <tr><th>Session ID</th><td>{info.sessionId}</td></tr>
            <tr>
              <th>Location</th>
              <td>
                {typeof info.location === 'string'
                  ? info.location
                  : `Lat: ${info.location.latitude}, Lng: ${info.location.longitude} (Accuracy: ${info.location.accuracy})`}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Login;
