import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const title = 'Winner';
    const bodyElement = document.createElement('div');
    bodyElement.innerText = fighter ? `${fighter.name} is the winner!` : "It's a tie!";
    bodyElement.className = 'winner-body';

    showModal({ title, bodyElement });
}
