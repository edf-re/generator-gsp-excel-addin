/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { DomainEventMessage, DomainEvents, getDomainEventMessenger } from './../../service/domain-events';

// Error messaging and notifications
function addMessage(domainEvent: DomainEventMessage) {
    const ul = document.getElementById("dynamic-list");
    const li = document.createElement("li");

    if (domainEvent.event == DomainEvents.SuccessfulExport) {
        li.setAttribute("style", "color:green;");
    }
    li.innerHTML = domainEvent.message;
    ul.appendChild(li);
}

const eventSubscriber = (domainEvent: DomainEventMessage) => {
    if (domainEvent.event == DomainEvents.SuccessfulExport
        || domainEvent.event == DomainEvents.Error) {
        addMessage(domainEvent);
    } else if(domainEvent.event == DomainEvents.ClearMessages){
        document.getElementById('dynamic-list').innerHTML = '';
    }
};

const messenger = getDomainEventMessenger();
messenger.subscribe(eventSubscriber);

export function clearMessages(message:string = ""){
    getDomainEventMessenger().sendEvent({event: DomainEvents.ClearMessages, message})
}
