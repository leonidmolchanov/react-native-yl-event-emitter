//
//  YLEventEmitterConstants.swift
//  RNYLEventEmitter
//
//  Created by Леонид Молчанов on 18.11.2023.
//

import Foundation

let GlobalEventName = "yl_module_event"

enum EventName: String {
    case YLModulesEvent = "YLModulesEvent"
}

let DefaultEventsName: [String] = [
    EventName.YLModulesEvent.rawValue
]



var ErrorCodes = [
    "timeout" : ErrorObject(code: "599", message: "the waiting time for the module response has been increased"),
    "parse" : ErrorObject(code: "428", message: "data error in the module"),
    "summary" : ErrorObject(code: "500", message: "Summary error in module")
]



struct ErrorObject {
  let code: String
  let message: String
}
