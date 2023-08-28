module Chapters.Form.InputDate exposing (chapter_)

import Date
import ElmBook
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Time
import W.InputDate


logValue : W.InputDate.Value -> ElmBook.Msg x
logValue value =
    case W.InputDate.toDate value of
        Just v_ ->
            logAction
                ("Just "
                    ++ Date.toIsoString (Date.fromPosix Time.utc v_)
                    ++ " "
                    ++ String.fromInt (Time.toHour Time.utc v_)
                    ++ ":"
                    ++ String.fromInt (Time.toMinute Time.utc v_)
                )

        Nothing ->
            logAction "Nothing"


chapter_ : Chapter x
chapter_ =
    chapter "Input Date"
        |> renderComponentList
            [ ( "Default"
              , W.InputDate.view
                    []
                    { value = W.InputDate.init Time.utc Nothing
                    , onInput = logValue
                    }
              )
            , ( "Custom Timezone (GMT-3)"
              , let
                    timeZone : Time.Zone
                    timeZone =
                        Time.customZone (-3 * 60) []
                in
                W.InputDate.view []
                    { value = W.InputDate.init timeZone (Just <| Time.millisToPosix 1651693959717)
                    , onInput = logValue
                    }
              )
            , ( "Validation"
              , W.InputDate.viewWithValidation
                    [ W.InputDate.min (Time.millisToPosix 1651693959717)
                    , W.InputDate.max (Time.millisToPosix 1671484833575)
                    ]
                    { value = W.InputDate.init Time.utc (Just (Time.millisToPosix 1651693959717))
                    , onInput = \_ -> logValue
                    }
              )
            ]
