import Foundation

@objc(YlEventEmitter)
public class YlEventEmitter: RCTEventEmitter {

    // Поддерживаемые типы событий (можно добавить динамический)
    var supportsEvents = DefaultEventsName
    // Буффер для работы с обратными вызовами событий
    var callbacksBuffers = [String : YLEventUUIDResponse]()

    // Стадартный метод регистрации событий в EventEmitter
    public override func supportedEvents() -> [String]! {
        return self.supportsEvents
    }
    // старт метода для отслеживания событий внутри приложения
    public override func startObserving() {
        NotificationCenter.default.addObserver(self, selector: #selector(emitEventInternal(_:)), name: NSNotification.Name(rawValue: GlobalEventName), object: nil)
    }

    // остановка метода для отслеживания событий внутри приложения
    public override func stopObserving() {
        NotificationCenter.default.removeObserver(self)
    }

    // Метод для отправки сообзения в eventEmitter от центра сообщений приложения
    @objc func emitEventInternal(_ notification: NSNotification)  {
        let target: String = notification.userInfo?["target"] as! String
        self.sendEvent(withName: target, body: notification.userInfo)
    }

    // Метод для УСТАНОВКИ событий в eventEmitter
    @objc(setSupportedEvents:)
    func setSupportedEvents(_ args: NSArray) {
        self.supportsEvents = args as! [String]
        print(args)
    }
    // Метод для ДОБАВЛЕНИЯ событий в eventEmitter
    @objc(addSupportedEvents:)
    func addSupportedEvents(_ args: NSArray) {
        self.supportsEvents = self.supportsEvents + args as! [String]
        print(self.supportsEvents)
    }
    // Метод обратного вызова (ответа) на запрос к модулю, включает в себя как успешный, так и ответ с ошибкой
    @objc(responseByUUID: data: error:)
    func responseByUUID(_ uuid: String, data:String, error: String?) {
        if let callback = self.callbacksBuffers[uuid] {
            if (error != nil) {
                callback.reject(ErrorCodes["summary"]?.code, error, error as? Error)
            }
            else{
                callback.resolve(data)
            }
            self.callbacksBuffers[uuid] = nil
        }
    }
    // Метод для отправки сообщения в модуль: target - Имя модуля, eventName- имя события в модуле, timeout - время ожидания ответа модуля, data - передаваемые данные в формате JSON
    @objc(sendEventToNative:eventName:timeout:data:withResolver:withRejecter:)
    func sendEventToNative(_ target: String, eventName: String?,timeout: NSInteger, data: String?, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
            do {
                // Уникальный индификатор запроса
                let uuid = NSUUID().uuidString
                var params = [
                    "target" : target,
                    "eventName": eventName,
                    "data": data,
                    "uuid": uuid
                ]
                self.callbacksBuffers[uuid] = YLEventUUIDResponse(resolve: resolve, reject: reject)


                NotificationCenter.default.post(name: NSNotification.Name(rawValue: GlobalEventName), object: self, userInfo: params)


                // Таймер бездействия, если модуль не отвечает вызывается этот блок
                if(timeout != 0){
                    DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(timeout)) {
                        if let callback = self.callbacksBuffers[uuid] {
                            callback.reject(ErrorCodes["timeout"]?.code, ErrorCodes["timeout"]?.message, ErrorCodes["timeout"]?.message as? Error)
                        }
                    }
                }

            } catch {
                reject("\(error._code)","YLModulesEvent - error parse message to emitter", error)
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

struct YLEventUUIDResponse {
  let resolve: RCTPromiseResolveBlock
  let reject: RCTPromiseRejectBlock
}
