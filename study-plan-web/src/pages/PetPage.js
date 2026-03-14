import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

// 猫粮价格: 10积分 = 1个猫粮
const CAT_FOOD_PRICE = 10;

export default function PetPage() {
  const { data, buyCatFood, feedCat, updateSettings } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'shop'
  const [message, setMessage] = useState(null);
  const [buyAmount, setBuyAmount] = useState(1);

  const { settings } = data;

  const canAfford = settings.totalPoints >= buyAmount * CAT_FOOD_PRICE;

  const handleFeed = () => {
    if (feedCat()) {
      setMessage('小猫咪吃得很开心！喵~ 🐱');
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage('猫粮不够啦，快去完成任务赚取积分吧！');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleBuy = () => {
    if (buyCatFood(buyAmount)) {
      setMessage(`成功购买 ${buyAmount} 碗猫粮！`);
      setBuyAmount(1);
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage('积分不足！完成任务可以获得积分~');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // 根据猫粮库存决定猫咪表情
  const getCatEmoji = () => {
    if (settings.catFood >= 5) return '😸'; // 很开心
    if (settings.catFood >= 2) return '😺'; // 正常
    if (settings.catFood >= 1) return '😐'; // 一般
    return '😿'; // 饿了
  };

  const getCatStatus = () => {
    if (settings.catFood >= 5) return { text: '很开心', color: '#27AE60' };
    if (settings.catFood >= 2) return { text: '还不错', color: '#F39C12' };
    if (settings.catFood >= 1) return { text: '有点饿', color: '#E67E22' };
    return { text: '非常饿', color: '#E74C3C' };
  };

  const status = getCatStatus();

  return (
    <div className="page pet-page">
      {/* Header */}
      <div className="header">
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>我的猫咪</h1>
        <div className="points-badge">
          <span>⭐</span>
          <span>{settings.totalPoints}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="pet-tabs">
        <button
          className={`pet-tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          投喂
        </button>
        <button
          className={`pet-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          买猫粮
        </button>
      </div>

      {/* Cat Display */}
      <div className="pet-section" style={{
        background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 100%)',
        padding: '30px 20px'
      }}>
        <div className="pet-bubble" style={{
          background: settings.catFood > 0 ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
          border: '4px solid #fff',
          boxShadow: '0 12px 40px rgba(255, 140, 66, 0.25)',
          width: '160px',
          height: '160px'
        }}>
          <span style={{ fontSize: '100px' }}>{getCatEmoji()}</span>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#2C3E50' }}>小猫咪</div>
          <div style={{ fontSize: '14px', color: status.color, marginTop: '6px', fontWeight: '500' }}>
            状态: {status.text}
          </div>
        </div>

        {/* 猫粮库存大显示 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '20px',
          padding: '16px 32px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          <span style={{ fontSize: '40px' }}>🥣</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', color: '#7F8C8D' }}>猫粮库存</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#FF8C42' }}>
              {settings.catFood} 碗
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 20px',
            background: '#FFF0E6',
            borderRadius: '20px',
            color: '#FF8C42',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease'
          }}>
            {message}
          </div>
        )}
      </div>

      {activeTab === 'feed' ? (
        /* 投喂界面 */
        <>
          <div className="interact-section">
            <div className="section-title">🥣 投喂猫粮</div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <button
                onClick={handleFeed}
                disabled={settings.catFood <= 0}
                style={{
                  padding: '20px 60px',
                  fontSize: '20px',
                  background: settings.catFood > 0 ? '#FF8C42' : '#BDC3C7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: settings.catFood > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  boxShadow: settings.catFood > 0 ? '0 8px 24px rgba(255, 140, 66, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {settings.catFood > 0 ? '🐱 投喂小猫咪' : '😿 猫粮不足'}
              </button>
              <div style={{ marginTop: '16px', fontSize: '14px', color: '#7F8C8D' }}>
                每投喂1碗猫粮，小猫咪会更开心！
              </div>
            </div>
          </div>

          {/* 提示 */}
          <div style={{ padding: '20px', margin: '0 16px 16px', background: '#fff', borderRadius: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#2C3E50', marginBottom: '12px' }}>
              💡 小贴士
            </div>
            <ul style={{ fontSize: '14px', color: '#7F8C8D', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>完成任务可以获得积分</li>
              <li>10积分可以兑换1碗猫粮</li>
              <li>猫粮越多，小猫咪越开心</li>
            </ul>
          </div>
        </>
      ) : (
        /* 买猫粮界面 */
        <div style={{ padding: '20px' }}>
          <div className="section-title">🛒 购买猫粮</div>

          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '60px', marginBottom: '8px' }}>🥣</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#2C3E50' }}>猫粮</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF8C42', marginTop: '8px' }}>
                {CAT_FOOD_PRICE} 积分 / 碗
              </div>
            </div>

            {/* 数量选择 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#7F8C8D', marginBottom: '12px' }}>购买数量</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <button
                  onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '2px solid #FF8C42',
                    background: '#fff',
                    color: '#FF8C42',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >-</button>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2C3E50', minWidth: '60px', textAlign: 'center' }}>
                  {buyAmount}
                </div>
                <button
                  onClick={() => setBuyAmount(buyAmount + 1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '2px solid #FF8C42',
                    background: '#fff',
                    color: '#FF8C42',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >+</button>
              </div>
            </div>

            {/* 总价 */}
            <div style={{
              background: '#F8F9FA',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#7F8C8D' }}>总计</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#FF8C42' }}>
                {buyAmount * CAT_FOOD_PRICE} 积分
              </span>
            </div>

            <button
              onClick={handleBuy}
              disabled={!canAfford}
              style={{
                width: '100%',
                padding: '16px',
                background: canAfford ? '#FF8C42' : '#BDC3C7',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: canAfford ? 'pointer' : 'not-allowed'
              }}
            >
              {canAfford ? '确认购买' : `积分不足 (还需 ${buyAmount * CAT_FOOD_PRICE - settings.totalPoints} 积分)`}
            </button>
          </div>

          <div style={{ fontSize: '13px', color: '#7F8C8D', textAlign: 'center' }}>
            当前积分: {settings.totalPoints}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ height: '100px' }}></div>
    </div>
  );
}
