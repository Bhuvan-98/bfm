'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Import Sidebar

function Dashboard() {
  const [info, setInfo] = useState(null);

  // ✅ Get Device Type
  const getDeviceType = () => {
    const ua = navigator.userAgent || 'Unknown';
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const hasMouse = window.matchMedia('(pointer:fine)').matches;

    if (/Mobi|Android/i.test(ua)) return 'Mobile';
    if (/Tablet|iPad/i.test(ua) || (maxTouchPoints > 1 && !/Mobi/i.test(ua) && !hasMouse)) return 'Tablet';
    if (hasMouse && window.screen.width > 1440) return 'Desktop';
    if (hasMouse) return 'Laptop';

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

      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          return '2G (Mobile Data)';
        case '3g':
          return '3G (Mobile Data)';
        case '4g':
          return downlink > 1 ? '5G' : '4G';
        default:
          return 'WiFi';
      }
    }

    return 'Unknown';
  };

  // ✅ Get Public IP and Location + ISP Details
  const getPublicIP = async () => {
    try {
      const isLocalhost = window.location.hostname === 'localhost';
      const endpoint = isLocalhost
  ? 'http://ip-api.com/json'
  : 'https://ipapi.co/json/';
  
      const res = await fetch(endpoint);
      const data = await res.json();
  
      return {
        ip: data.ip || data.query || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || data.regionName || 'Unknown',
        country: data.country || 'Unknown',
        isp: data.isp || data.org || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching IP info:', error);
      return {
        ip: 'Failed to fetch',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        isp: 'Unknown',
      };
    }
  };
  
  // ✅ Get Private IP using WebRTC
const getPrivateIP = () => {
  return new Promise((resolve) => {
    const rtc = new RTCPeerConnection({ iceServers: [] });

    rtc.createDataChannel('');
    rtc.createOffer()
      .then((offer) => rtc.setLocalDescription(offer))
      .catch(() => {});

    rtc.onicecandidate = (event) => {
      if (event && event.candidate && event.candidate.candidate) {
        const parts = event.candidate.candidate.split(' ');
        const ip = parts[4];
        if (ip && ip.indexOf('.') !== -1) {
          resolve(ip);
          rtc.close();
        }
      }
    };

    setTimeout(() => {
      resolve('Unknown');
    }, 1000);
  });
};

  const getLocation = () =>
    new Promise(async (resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: `${Math.round(position.coords.accuracy)} meters`,
            });
          },
          async () => {
            console.warn('Geolocation failed, using IP-based location');
            const publicIpInfo = await getPublicIP();
            resolve({
              latitude: 'Unknown',
              longitude: 'Unknown',
              accuracy: `IP-based Location: ${publicIpInfo.city}, ${publicIpInfo.region}, ${publicIpInfo.country}`,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.warn('Geolocation not supported, using IP-based location');
        const publicIpInfo = await getPublicIP();
        resolve({
          latitude: 'Unknown',
          longitude: 'Unknown',
          accuracy: `IP-based Location: ${publicIpInfo.city}, ${publicIpInfo.region}, ${publicIpInfo.country}`,
        });
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
    const networkType = getNetworkInfo();
    const loginTimestamp = new Date().toISOString();
    const sessionId = `session_${Math.random().toString(36).substring(2)}`;
    const location = await getLocation();
    const publicIpInfo = await getPublicIP();
    const privateIp = await getPrivateIP();

    setInfo({
      deviceType,
      os,
      browserName: browser.name,
      browserVersion: browser.version,
      screenResolution,
      timezone,
      localTime,
      publicIp: publicIpInfo.ip,
      privateIp, 
      city: publicIpInfo.city,
      region: publicIpInfo.region,
      country: publicIpInfo.country,
      isp: publicIpInfo.isp, // ➡️ Store ISP info
      networkType,
      loginTimestamp,
      sessionId,
      location,
    });
  };

  useEffect(() => {
    getInfo();
  }, []);


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
       <Sidebar />
       <div style={{ flex: 1, padding: '20px' }}>
      {info && (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr><th>Device Type</th><td>{info.deviceType}</td></tr>
            <tr><th>Operating System</th><td>{info.os}</td></tr>
            <tr><th>Browser</th><td>{info.browserName} {info.browserVersion}</td></tr>
            <tr><th>Screen Resolution</th><td>{info.screenResolution}</td></tr>
            <tr><th>Timezone</th><td>{info.timezone}</td></tr>
            <tr><th>Local Time</th><td>{info.localTime}</td></tr>
            <tr><th>Private IP</th><td>{info.privateIp}</td></tr>
            <tr><th>Public IP</th><td>{info.publicIp}</td></tr>
            <tr><th>City</th><td>{info.city}</td></tr>
            <tr><th>Region</th><td>{info.region}</td></tr>
            <tr><th>Country</th><td>{info.country}</td></tr>
            <tr><th>Network Type</th><td>{info.networkType}</td></tr>
             <tr><th>ISP</th><td>{info.isp}</td></tr>
            <tr><th>Login Timestamp</th><td>{info.loginTimestamp}</td></tr>
            <tr><th>Session ID</th><td>{info.sessionId}</td></tr>
            <tr>
              <th>Location</th>
              <td>
                {`Lat: ${info.location.latitude}, Lng: ${info.location.longitude} (Accuracy: ${info.location.accuracy})`}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

export default Dashboard;
