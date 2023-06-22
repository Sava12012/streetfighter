import controls from '../../constants/controls';
import { getElementBySelector } from '../helpers/domHelper';

const blockCombination = new Set();
const criticalCombination = new Set();

export function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = Math.random() + 1;
    const hitPower = attack * criticalHitChance;

    return hitPower;
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = Math.random() + 1;
    const blockPower = defense * dodgeChance;

    return blockPower;
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = Math.max(0, hitPower - blockPower);

    return damage;
}

function updateHealthBar(fighter, maxHealth, indicatorId) {
    const currentHealth = fighter.health;
    const healthPercentage = Math.round((currentHealth / maxHealth) * 100);
    const healthBar = getElementBySelector(indicatorId);
    healthBar.style.width = `${healthPercentage}%`;
}

function checkBlockCombination(fighter, opponent) {
    const blockCombinationArray = Array.from(blockCombination);
    const localFighter = fighter;

    if (
        blockCombinationArray.includes(controls.PlayerOneBlock) &&
        blockCombinationArray.includes(controls.PlayerTwoBlock)
    ) {
        const opponentDamage = getDamage(opponent, localFighter);
        localFighter.health -= opponentDamage;
        updateHealthBar(localFighter, '#left-fighter-indicator');
    }
}

function checkCriticalCombination(fighter, opponent, opponentMaxHealth) {
    const criticalCombinationArray = Array.from(criticalCombination);
    const localOpponent = opponent;
    if (
        criticalCombinationArray.length === 3 &&
        criticalCombinationArray.every(key => controls.PlayerOneCriticalHitCombination.includes(key))
    ) {
        const damage = getHitPower(fighter) * 2;
        localOpponent.health -= damage;
        updateHealthBar(localOpponent, opponentMaxHealth, '#right-fighter-indicator');
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const maxRoundTime = 90000; // Maximum round time in milliseconds (90 seconds)
        let isFightOver = false;
        const localfirstFighter = firstFighter;
        const localsecondFighter = secondFighter;
        const firstFighterMaxHealth = localfirstFighter.health;
        const secondFighterMaxHealth = localsecondFighter.health;

        const handleKeyPress = event => {
            const key = event.code;

            if (key === controls.PlayerOneAttack && !isFightOver) {
                const damage = getDamage(localfirstFighter, localsecondFighter);
                localsecondFighter.health -= damage;

                updateHealthBar(localsecondFighter, secondFighterMaxHealth, '#right-fighter-indicator');
                if (localsecondFighter.health <= 0) {
                    isFightOver = true;
                    resolve(localfirstFighter);
                }
            } else if (key === controls.PlayerTwoAttack && !isFightOver) {
                const damage = getDamage(localsecondFighter, localfirstFighter);
                localfirstFighter.health -= damage;
                updateHealthBar(firstFighter, firstFighterMaxHealth, '#left-fighter-indicator');
                if (localfirstFighter.health <= 0) {
                    isFightOver = true;
                    resolve(localsecondFighter);
                }
            } else if (key === controls.PlayerOneBlock) {
                blockCombination.add(key);
                checkBlockCombination(localfirstFighter, localsecondFighter);
            } else if (key === controls.PlayerTwoBlock) {
                blockCombination.add(key);
                checkBlockCombination(localsecondFighter, localfirstFighter);
            } else if (controls.PlayerOneCriticalHitCombination.includes(key)) {
                criticalCombination.add(key);
                checkCriticalCombination(localfirstFighter, localsecondFighter, secondFighterMaxHealth);
            } else if (controls.PlayerTwoCriticalHitCombination.includes(key)) {
                criticalCombination.add(key);
                checkCriticalCombination(localsecondFighter, localfirstFighter, firstFighterMaxHealth);
            }

            setTimeout(() => {
                isFightOver = true;

                if (localfirstFighter.health > localsecondFighter.health) {
                    resolve(localfirstFighter);
                } else if (localsecondFighter.health > localfirstFighter.health) {
                    resolve(localsecondFighter);
                } else {
                    resolve(null); // If it's a tie, resolve with null
                }
            }, maxRoundTime);
        };

        document.addEventListener('keydown', handleKeyPress);
    });
}
