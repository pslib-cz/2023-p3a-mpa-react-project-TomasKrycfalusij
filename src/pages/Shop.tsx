import { Link } from 'react-router-dom';
import shopStyle from './Shop.module.css';
import { Context } from '../components/ContextProvider';
import { Upgrade, ActionType } from '../types/ReducerTypes';
import { useContext } from 'react';

const Shop = () => {
  const { playerStats, dispatch } = useContext(Context);

  const handleBuyItem = (name: string, cost: number) => {
    const upgrade = playerStats.upgrades.find((u: Upgrade) => u.name === name);

    if (upgrade && (!upgrade.level || upgrade.level < 6)) {
      if (playerStats.money >= cost) {
        dispatch({ type: ActionType.UPDATE_MONEY, payload: -cost });

        const newLevel = (upgrade.level ?? 1) + 1;

        const updatedUpgrades = playerStats.upgrades.map((u: Upgrade) => {
          if (u.name === name) {
            return { ...u, level: newLevel, price: u.cost * newLevel};
          }
          return u;
        });

        dispatch({ type: ActionType.UPDATE_UPGRADE, payload: { upgradeName: name, owned: true } });
        upgrade.level? dispatch({ type: ActionType.UPDATE_UPGRADE_LEVEL, payload: { upgradeName: name, level: newLevel } }) : null;

        const updatedPlayerStats = { ...playerStats, upgrades: updatedUpgrades };

        localStorage.setItem('playerStats', JSON.stringify(updatedPlayerStats));
      } else {
        alert("Insufficient funds!");
      }
    } else {
      alert("Upgrade is at maximum level!");
    }
  };

  return (
    <div className={shopStyle.pageContainer}>
      <h1>SHOP</h1>
      <p className={shopStyle.moneyText}>Money: {playerStats.money}</p>
      <div className={shopStyle.upgradesMenu}>
        {playerStats.upgrades.map((upgrade: Upgrade, index: number) => {
          return (
            <div className={shopStyle.singleUpgrade} key={index}>
              <h2>{upgrade.name}</h2>
              {
                upgrade.level && upgrade.level > 1 && <p>Level: {upgrade.level - 1} / 5</p>
              }
              {
                (!upgrade.owned || (Number(upgrade.level) < 6))?
                <p>Cost: {upgrade.level? upgrade.cost * upgrade.level : upgrade.cost}</p>
                : null
              }
              <button
                className="btn btnReversedColor"
                disabled={upgrade.owned && (!upgrade.level || upgrade.level === 6)}
                onClick={() => handleBuyItem(upgrade.name, upgrade.level? upgrade.cost * upgrade.level : upgrade.cost)}
              >
                {upgrade.owned ? (upgrade.level && upgrade.level < 6? 'Upgrade' : 'Owned') : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
      <div className="linksContainer">
        <Link className="alink" to="/levels">Levels</Link>
        <Link className="alink" to="/">Main menu</Link>
      </div>
    </div>
  );
};

export default Shop;
