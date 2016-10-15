"use strict";
exports.chatTemplate = "<div id=\"ovt-chat\">\n<div #messagesBox class=\"messages\" [scrollTop]=\"messagesBox.scrollHeight\">\n\t<ovt-chatMessage *ngFor=\"let message of messages\" [sender]=\"message.sender\" [message]=\"message.message\" [date]=\"message.date\" [color]=\"message.color\"></ovt-chatMessage>\n\t\t\t</div>\n<div class=\"mailbox\">\n\t\t\t\t\t<textarea id=\"myMessage\" [(ngModel)]=\"message\" name=\"message\"type=\"text\" class=\"input-block-level\" placeholder=\"Your message...\"></textarea>\n\t\t\t\t\t<input id=\"sendMessage\" (click)=\"sendMessage()\" type=\"submit\" class=\"btn btn-large btn-block btn-primary\"\n\t\t\t\t\t\tvalue=\"Send\" />\n\t\t\t\t</div>\n                </div>";
//# sourceMappingURL=chat.html.js.map