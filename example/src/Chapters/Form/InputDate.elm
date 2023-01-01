module Chapters.Form.InputDate exposing (..)

import Date
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Time
import W.InputDate


chapter_ : Chapter x
chapter_ =
    chapter "Input Date"
        |> renderComponentList
            [ ( "Default"
              , W.InputDate.view
                    []
                    { value = Nothing
                    , timeZone = Time.utc
                    , onInput =
                        \v ->
                            case v of
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
                    }
              )
            , ( "Custom Timezone (GMT-3)"
              , let
                    timeZone =
                        Time.customZone (-3 * 60) []
                in
                W.InputDate.view []
                    { value = Just (Time.millisToPosix 1651693959717)
                    , timeZone = timeZone
                    , onInput =
                        \v ->
                            case v of
                                Just v_ ->
                                    logAction
                                        ("Just "
                                            ++ Date.toIsoString (Date.fromPosix timeZone v_)
                                            ++ " "
                                            ++ String.fromInt (Time.toHour timeZone v_)
                                            ++ ":"
                                            ++ String.fromInt (Time.toMinute timeZone v_)
                                        )

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
                W.InputDate.viewWithValidation
                    [ W.InputDate.min (Time.millisToPosix 1651693959717)
                    , W.InputDate.max (Time.millisToPosix 1671484833575)
                    ]
                    { value = Just (Time.millisToPosix 1651693959717)
                    , timeZone = timeZone
                    , onInput =
                        \_ v ->
                            case v of
                                Just v_ ->
                                    logAction
                                        ("Just "
                                            ++ Date.toIsoString (Date.fromPosix timeZone v_)
                                            ++ " "
                                            ++ String.fromInt (Time.toHour timeZone v_)
                                            ++ ":"
                                            ++ String.fromInt (Time.toMinute timeZone v_)
                                        )

                                Nothing ->
                                    logAction "Nothing"
                    }
              )
            ]
