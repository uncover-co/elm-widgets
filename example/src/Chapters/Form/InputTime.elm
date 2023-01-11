module Chapters.Form.InputTime exposing (chapter_)


import ElmBook
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Time
import W.InputTime


logValue : W.InputTime.Value -> ElmBook.Msg x
logValue value =
    case (W.InputTime.toTime value) of
        Just v_ ->
            logAction ("Just " ++ String.fromInt (Time.toHour (W.InputTime.toTimeZone value) v_) ++ ":" ++ String.fromInt (Time.toMinute (W.InputTime.toTimeZone value) v_) ++ ":" ++ String.fromInt (Time.toSecond (W.InputTime.toTimeZone value) v_))

        Nothing ->
            logAction "Nothing"

chapter_ : Chapter x
chapter_ =
    chapter "Input Time"
        |> withComponentList
            [ ( "Default"
              , W.InputTime.view
                    []
                    { value = W.InputTime.init Time.utc Nothing
                    , onInput = logValue
                    }
              )
            , ( "Custom Timezone (GMT-3)"
              , let
                    timeZone : Time.Zone
                    timeZone =
                        Time.customZone (-3 * 60) []
                in
                W.InputTime.view []
                    { value = W.InputTime.init Time.utc (Just (Time.millisToPosix 1651693959717))
                    , onInput = logValue
                    }
              )
            , ( "Validation"
              , W.InputTime.viewWithValidation
                    [ W.InputTime.step 15
                    , W.InputTime.min (Time.millisToPosix 1651693959717)
                    , W.InputTime.max (Time.millisToPosix 1671484833575)
                    ]
                    { value = W.InputTime.init Time.utc (Just (Time.millisToPosix 1651693959717))
                    , onInput = \_ -> logValue
                    }
              )
            ]
        |> renderWithComponentList """
`InputTime` receives an `Time.Posix` and returns a `Time.Posix`. We can retrieve specifics like hour, minutes and hours using the `Time` package.

Let's say we just got the current timestamp using the `Time.now` Cmd. We can just pass it to the input time directly and select a new time based on the same day.

By default this component uses `Time.utc` so if we're in a different zone, we should pass in the optional attribute `InputTime.timeZone`.
"""
