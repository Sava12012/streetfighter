import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function createFighterInfoBlock(infoName, infoValue) {
    const infoTitle = createElement({ tagName: 'span', className: 'fighter-preview___info-title' });
    infoTitle.textContent = `${infoName.toUpperCase()}:`;
    const infoText = createElement({ tagName: 'span', className: 'fighter-preview___info-title' });
    infoText.textContent = infoValue;

    const wrapper = createElement({ tagName: 'div', className: 'fighter-preview___information-wrapper' });
    wrapper.append(infoTitle, infoText);
    return wrapper;
}

function createFighterInfo(fighter) {
    const { name: Name, health: Health, attack: Attack, defense: Defense } = fighter;
    const fighterInfo = { Name, Health, Attack, Defense };
    const infoWrapper = createElement({
        tagName: 'div',
        className: 'fighter-preview___info'
    });

    Object.keys(fighterInfo).forEach(key => {
        infoWrapper.append(createFighterInfoBlock(key, fighterInfo[key]));
    });

    return infoWrapper;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)

    if (fighter) {
        fighterElement.append(createFighterInfo(fighter));
        fighterElement.append(createFighterImage(fighter));
    }

    return fighterElement;
}
