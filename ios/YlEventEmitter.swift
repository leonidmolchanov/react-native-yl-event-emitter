import Foundation

@objc(YlEventEmitter)
public class YlEventEmitter: RCTEventEmitter {

    public override func supportedEvents() -> [String]! {
        return ["YLModulesEvent"]
    }
    public override func startObserving() {
        NotificationCenter.default.addObserver(self, selector: #selector(emitEventInternal(_:)), name: NSNotification.Name(rawValue: "event-emitted"), object: nil)
    }

    public override func stopObserving() {
        NotificationCenter.default.removeObserver(self)
    }

    @objc func emitEventInternal(_ notification: NSNotification)  {
        let eventName: String = notification.userInfo?["eventName"] as! String
        self.sendEvent(withName: eventName, body: notification.userInfo)
    }

    @objc(sendEventToNative:withResolver:withRejecter:)
     func sendEventToNative(_ json: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {


        // Decoding
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode(JSONMessage.self, from: json.data(using: .utf8)!)
                var params = response.data
                params["eventName"] = response.eventName
                NotificationCenter.default.post(name: NSNotification.Name(rawValue: response.rawValue), object: self, userInfo: params)


                if #available(iOS 13.0, *) {
                    Task {
                        do {

                            if #available(iOS 15, *) {
                                let customNotificationName = Notification.Name("event-emitted")
                                let notifications = NotificationCenter.default.notifications(named: customNotificationName,
                                                                                             object: nil)

                                let seconds = 4.0
                                DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
//                                    reject("48", error.localizedDescription, error as! Error)
                                    return
                                }

                                for await notification in notifications {
                                    print("hohoh")
                                    print(notification.userInfo)
                                    print("hohoh-end")
                                    if((notification.userInfo?["payload"]) != nil){
                                        resolve(notification.userInfo)
                                    }
                                    return
                                }

                            } else {
//                                reject("02", "Отработала задержка", "Отработала задержка" as! Error)

                            }

                        } catch {
//                            reject("02", "Отработала задержка", "Отработала задержка" as! Error)

                        }
                    }
                }


                NotificationCenter.default.post(name: NSNotification.Name(rawValue: "event-emitted"), object: self, userInfo: ["eventName":"YLModulesEvent", "payload":params])

            } catch {
                print(error)
                reject("\(error._code)","YLModulesEvent - error parse message to emitter", error)
            }
    }


    public static func sendEventToJS (_ payload:[String: String]){
        do {
            let convertPayload = YLEventEmitterSendData(data:payload)
            let encodedData = try JSONEncoder().encode(convertPayload)
            let jsonString = String(data: encodedData,
                                    encoding: .utf8)
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: "event-emitted"), object: self, userInfo: ["eventName":"YLModulesEvent", "payload":jsonString])
        } catch {
            print(error)
        }
    }

}

struct JSONMessage:Decodable {
  let eventName: String
  let rawValue: String
  let data: [String: String]
}


struct YLEventEmitterSendData: Codable {
    let data: [String: String]
}
