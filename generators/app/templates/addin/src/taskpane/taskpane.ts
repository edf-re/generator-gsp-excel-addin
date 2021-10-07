import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80.png";

import { container } from "./container";
import { loginInitialize, tryLogin } from "./Logic/sso";
import { documentWrapper } from "./Logic/document-wrapper";
import { IButtonDisabler } from "./types/interfaces/button-disabler.interface";
import { clearMessages } from "./Logic/user-message-handling";

import { commandMapper } from '../service/command-map';
import { DomainEvents, sendGlobalEvent } from '../service/domain-events'; //from "./../..//service/domain-events";

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    addHandlerForLoginSubmit()
    attachButtonActions();
    loginInitialize();
  }
});

function addHandlerForLoginSubmit() {
  documentWrapper.getElementById('loginForm').addEventListener('submit', tryLogin);
}

function attachButtonActions() {

  const buttons = document.querySelectorAll('button[data-command]');
  buttons.forEach(button => {
    console.log('button added', button);
    button.addEventListener('click', buttonClickRouter);
  });
}

function getButtonIdsToDisable(): string[] {
  const buttons = document.querySelectorAll('button[data-btndisable]',);

  const buttonIds: string[] = []
  buttons.forEach(element => {
    buttonIds.push(element.id);
  });
  return buttonIds;

}

async function buttonClickRouter(event: any) {
  event.preventDefault();
  clearMessages();

  const commandName = event.target.dataset.command;
  const buttonDisabler: IButtonDisabler = container.getType('IButtonDisabler')();
  const buttonIdsToDisable = getButtonIdsToDisable();

  await buttonDisabler.disableThenExecute(buttonIdsToDisable, async () => {
    await Excel.run(async (context) => {
      await commandMapper(commandName, context);
    }).catch((error) => {
      sendGlobalEvent({
        event: DomainEvents.Error,
        message: `${error}`
      });

      console.error('button error', error);
    });
  })


}
