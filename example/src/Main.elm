module Main exposing (main)

import Chapters.Core.ButtonGroup
import Chapters.Core.Buttons
import Chapters.Core.Divider
import Chapters.Core.Loading
import Chapters.Form.Field
import Chapters.Form.InputAutocomplete
import Chapters.Form.InputCheckbox
import Chapters.Form.InputDate
import Chapters.Form.InputNumber
import Chapters.Form.InputRadio
import Chapters.Form.InputSelect
import Chapters.Form.InputSlider
import Chapters.Form.InputText
import Chapters.Form.InputTextArea
import Chapters.Form.InputTime
import Chapters.Information.DataRow
import Chapters.Information.Menu
import Chapters.Information.Pagination
import Chapters.Information.Popover
import Chapters.Information.Tag
import Chapters.Information.Tooltip
import Chapters.Information.Badge
import Chapters.Information.Message
import Chapters.Layout.Modal
import ElmBook exposing (Book, book, withChapterGroups, withStatefulOptions, withThemeOptions)
import ElmBook.Chapter
import ElmBook.StatefulOptions
import ElmBook.ThemeOptions
import Theme
import W.Styles


type alias SharedState =
    { range :
        { default : Float
        , customColor : Float
        }
    , inputNumber : Chapters.Form.InputNumber.Model
    , inputTextArea : Chapters.Form.InputTextArea.Model
    }


wip : String -> ElmBook.Chapter.Chapter x
wip title =
    ElmBook.Chapter.chapter (title ++ " WIP") |> ElmBook.Chapter.render "WIP"


main : Book SharedState
main =
    book "elm-widgets"
        |> withStatefulOptions
            [ ElmBook.StatefulOptions.initialState
                { range = Chapters.Form.InputSlider.init
                , inputNumber = Chapters.Form.InputNumber.init
                , inputTextArea = Chapters.Form.InputTextArea.init
                }
            ]
        |> withThemeOptions
            [ ElmBook.ThemeOptions.globals
                [ Theme.globalProviderWithDarkMode
                    { light = Theme.lightTheme
                    , dark = Theme.darkTheme
                    , strategy = Theme.classStrategy "elm-book-dark-mode"
                    }
                , W.Styles.globalStyles
                ]
            ]
        |> withChapterGroups
            [ ( "Core"
              , [ Chapters.Core.Buttons.chapter_
                , Chapters.Core.ButtonGroup.chapter_
                , wip "CallToAction"
                , Chapters.Core.Divider.chapter_
                , Chapters.Core.Loading.chapter_
                ]
              )
            , ( "Layout"
              , [ Chapters.Layout.Modal.chapter_
                , wip "Drawer"
                ]
              )
            , ( "Information"
              , [ Chapters.Information.DataRow.chapter_
                , Chapters.Information.Popover.chapter_
                , Chapters.Information.Tooltip.chapter_
                , Chapters.Information.Menu.chapter_
                , Chapters.Information.Tag.chapter_
                , Chapters.Information.Badge.chapter_
                , wip "Table"
                , wip "Toast"
                , Chapters.Information.Message.chapter_
                , Chapters.Information.Pagination.chapter_
                ]
              )
            , ( "Form"
              , [ Chapters.Form.Field.chapter_
                , Chapters.Form.InputText.chapter_
                , Chapters.Form.InputTextArea.chapter_
                , Chapters.Form.InputNumber.chapter_
                , Chapters.Form.InputTime.chapter_
                , Chapters.Form.InputDate.chapter_
                , Chapters.Form.InputAutocomplete.chapter_
                , Chapters.Form.InputCheckbox.chapter_
                , Chapters.Form.InputRadio.chapter_
                , Chapters.Form.InputSelect.chapter_
                , Chapters.Form.InputSlider.chapter_
                ]
              )
            ]
