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
                    , timeZone = Time.utc
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
                W.InputTime.view []
                    { value = Just (Time.millisToPosix 1651693959717)
                    , timeZone = timeZone
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction ("Just " ++ String.fromInt (Time.toHour timeZone v_) ++ ":" ++ String.fromInt (Time.toMinute timeZone v_))

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            , ( "Validation"
              , let
                    timeZone : Time.Zone
                    timeZone =
                        Time.utc
                in
                W.InputTime.viewWithValidation
                    [ W.InputTime.step 15
                    , W.InputTime.min (Time.millisToPosix 1651693959717)
                    , W.InputTime.max (Time.millisToPosix 1671484833575)
                    ]
                    { value = Just (Time.millisToPosix 1651693959717)
                    , timeZone = timeZone
                    , onInput =
                        \_ v ->
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
