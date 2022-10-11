module Chapters.Form.InputTime exposing (..)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Time
import W.InputTime


chapter_ : Chapter x
chapter_ =
    chapter "Input Time"
        |> withComponentList
            [ ( "Default"
              , W.InputTime.view
                    []
                    { value = Nothing
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction ("Just " ++ String.fromInt (Time.toHour Time.utc v_) ++ ":" ++ String.fromInt (Time.toMinute Time.utc v_) ++ ":" ++ String.fromInt (Time.posixToMillis v_))

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            , ( "Custom Timezone (GMT-3)"
              , let
                    timeZone =
                        Time.customZone (-3 * 60) []
                in
                W.InputTime.view
                    [ W.InputTime.timeZone timeZone
                    ]
                    { value = Just (Time.millisToPosix 1651693959717)
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction ("Just " ++ String.fromInt (Time.toHour timeZone v_) ++ ":" ++ String.fromInt (Time.toMinute timeZone v_))

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            ]
        |> renderWithComponentList """
`InputTime` receives an `Time.Posix` and returns a `Time.Posix`. We can retrieve specifics like hour, minutes and hours using the `Time` package.

Let's say we just got the current timestamp using the `Time.now` Cmd. We can just pass it to the input time directly and select a new time based on the same day.

By default this component uses `Time.utc` so if we're in a different zone, we should pass in the optional attribute `InputTime.timeZone`.
"""
