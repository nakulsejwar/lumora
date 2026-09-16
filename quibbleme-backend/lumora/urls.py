from django.contrib import admin
from django.urls import path, include
from .api import views
urlpatterns = [
    # path('upload/data/', views.DataUploadPage, name="file-upload"),
    # path('export/games/', views.GameUploadPage, name="file-upload"),
    # # path('export/courses/', views.CourseUploadPage, name="file-upload"),
    # # path('export/logs/', views.LogsPage, name="file-upload"),
    # path('export/support/', views.SupportPage, name="file-upload"),
    #path('export-admin-data/', views.export_admin_data, name="export-admin-data"),
    path('upload-lumora-images/', views.ImageUpload, name="upload-lumora-images"),
    path('upload-image/', views.api_upload_single_image, name="upload-single-image"),
    #path('export-game-template/', views.ExportGameTemplate, name="export-game-template"),
    # path('export-games', views.GamesExport, name="export-games"),
    #  path('export-mcq-template/', views.ExportMCQTemplate, name="export-mcq-template"),
    # path('export-mcq', views.MCQExport, name="export-mcq"),
    
    # path('export-category-template/', views.ExportCategoryTemplate, name="export-category-template"),
    # path('export-category', views.CategoryExport, name="export-category"),

    # path('export-mixed-template/', views.ExportMixedTemplate, name="export-mixed-template"),
    # path('export-mixed', views.MixedExport, name="export-mixed"),

    # path('course-specific-export/', views.ExportSpecificCourse, name="course-specific-export"),
    # path('export-course-template/', views.ExportCourseTemplate, name="export-course-template"),
    # path('export-course', views.CourseExport, name="export-course"),

    # path('export-topic-template/', views.ExportTopicTemplate, name="export-topic-template"),
    # path('export-topic', views.TopicExport, name="export-topic"),

    # path('export-level-template/', views.ExportLevelTemplate, name="export-level-template"),
    # path('export-level', views.LevelExport, name="export-level"),

    # path('export-tile-template/', views.ExportTileTemplate, name="export-tile-template"),
    # path('export-tile', views.TileExport, name="export-tile"),

    # path('export-support-cases-lumora/', views.export_support_cases, name="export-support-cases-lumora"),
    # path('export-event-logs/', views.export_logs, name="export-event-logs"),
    path('fetch-games/', views.FetchGames.as_view(), name='fetch-games'),
    path('fetch-games-main/', views.FetchGamesMain.as_view(), name='fetch-games-main'),
    path('fetch-game-data/', views.FetchGamedata.as_view(), name='fetch-game-data/'),

    path('fetch-tile/', views.Fetchtile.as_view(), name='fetch-tile'),
    path('fetch-tile-data/', views.FetchtileData.as_view(), name='fetch-tile-data/'),
    path('fetch-tile-data-main/', views.FetchtileDataMain.as_view(), name='fetch-tile-data-main/'),
    path('fetch-mcq-questions/', views.FetchMCQQuestions.as_view(), name='fetch-mcq-questions/'),
    path('fetch-mixed-questions/', views.FetchMixedQuestions.as_view(), name='fetch-mixed-questions/'),
    path('fetch-game-data-test/', views.FetchGamedata_test.as_view(), name='fetch-game-data-test/'),
    path('fetch-journey-data/', views.FetchCourse.as_view(), name='fetch-journey-data'),
     path('fetch-journey-data-main/', views.FetchCourseMain.as_view(), name='fetch-journey-data-main'),

    path('fetch-category-data/', views.FetchCategoryData.as_view(), name='fetch-category-data'),
     path('fetch-category-courses/', views.FetchCoursesByCategory.as_view(), name='fetch-category-courses'),
 path('fetch-category-blogs/', views.FetchBlogsByCategory.as_view(), name='fetch-category-blogs'),

     path('fetch-next-gameid/', views.FetchNextGame.as_view(), name='fetch-next-gameid'),
      path('fetch-next-gameid-main/', views.FetchNextGameMain.as_view(), name='fetch-next-gameid-main'),
     path('fetch-topics-data/', views.FetchTopics.as_view(), name='fetch-topics-data'),
     path('fetch-topics-data-main/', views.FetchTopicsMain.as_view(), name='fetch-topics-data-main'),
     path('fetch-level-games-data/', views.FetchlevelsGames.as_view(), name='fetch-level-games-data'),
     path('fetch-level-games-data-main/', views.FetchlevelsGamesMain.as_view(), name='fetch-level-games-data-main'),
    path('set-user-score/', views.SetScore, name='set-user-score'),
    path('get-user-score/', views.GetScore, name='get-user-score'),
    path('get-played-games/', views.GetGamesPlayed, name='get-played-games'),
    path('get-streak-data/', views.GetStreakdata, name='get-streak-data'),
    path('record-question-answer/', views.RecordQuestionAnswer, name='record-question-answer'),
    path('get-skill-mastery/', views.GetSkillMastery, name='get-skill-mastery'),
    path('generate-adaptive-lesson/', views.GenerateAdaptiveLesson.as_view(), name='generate-adaptive-lesson'),
    path('grade-explanation/', views.GradeExplanation, name='grade-explanation'),
    #path('contact-email/', views.SendContactEmail.as_view(), name='contact-email'),
    path('set-user-data/', views.SetUserData, name='set-user-data'),
    path('create-user/', views.CreateUser.as_view(), name='create-user'),
    path('event-logs/', views.EventLogs.as_view(), name='event-logs'),
    path('validate-admin/', views.ValidateAdminMail.as_view(), name='validate-admin'),

    path('fetch-admin-course/', views.FetchAllCourses.as_view(), name='create-admin-course'),
    path('create-admin-course/', views.CreateCourseAdmin.as_view(), name='create-admin-course'),
    path('create-admin-topic/', views.CreateTopicAdmin.as_view(), name='create-admin-topic'),
    path('create-admin-level/', views.CreateLevelAdmin.as_view(), name='create-admin-level'),
    path('create-admin-game/', views.CreateGameAdmin.as_view(), name='create-admin-game'),
    path('create-admin-tile/', views.CreateTileAdmin.as_view(), name='create-admin-tile'),

    path('save-admin-history/', views.SaveAdminData.as_view(), name='save-admin-history'),
    path('get-admin-history/', views.GetAdminData.as_view(), name='get-admin-history'),
    path('delete-admin-history/', views.DeleteAdminData.as_view(), name='delete-admin-history'),
    path('get-admin-courses/', views.GetAdminCourses.as_view(), name='get-admin-courses'),

    path('delete-admin-data/', views.DeleteAdminCourse.as_view(), name='delete-admin-data'),
    
    path('update-field-value/', views.UpdateFieldValue.as_view(), name='update-field-value'),
    path('update-live-field/', views.UpdateLiveField.as_view(), name='update-live-field'),

    path('copy-data/', views.CopyData.as_view(), name='copy-data'),

    path('queue-course-creation/', views.QueueCourseCreation.as_view(), name='queue-course-creation'),
    path('generate-games/', views.GenerateGames.as_view(), name='generate-games'),
    path('gemini/', views.GeminiProxy.as_view(), name='gemini-proxy'),
    path('generate-course-app07/', views.GenerateCourseApp07View.as_view(), name='generate-course-app07'),
    path('generate-games-app07/', views.GenerateGamesApp07View.as_view(), name='generate-games-app07'),
    path('regenerate-course-app07/', views.RegenerateCourseApp07View.as_view(), name='regenerate-course-app07'),
    path('regenerate-module-app07/', views.RegenerateModuleApp07View.as_view(), name='regenerate-module-app07'),
    path('get-queue-data/', views.GetQueueData.as_view(), name='get-queue-data'),

    path('library/books/create/', views.CreateBook.as_view(), name='create-book'),
    path('library/books/update/', views.UpdateBook.as_view(), name='update-book'),
    path('library/books/delete/', views.DeleteBook.as_view(), name='delete-book'),
    path('library/books/admin/', views.FetchAdminBooks.as_view(), name='fetch-admin-books'),
    path('library/books/detail/', views.FetchBookById.as_view(), name='fetch-book-by-id'),
    path('library/books/', views.FetchBooks.as_view(), name='fetch-books'),
    path('library/books/genre/', views.FetchBooksByGenre.as_view(), name='fetch-genre-books'),

    path('create-blog/', views.CreateBlog.as_view(), name='create-blog'),
    path('edit-blog/', views.editBlog.as_view(), name='update-blog'),
    path('delete-blog/', views.DeleteBlog.as_view(), name='delete-blog'),
    path('fetch-admin-blogs/', views.FetchAdminBlogs.as_view(), name='fetch-admin-blogs'),
    path('fetch-blog-by-id/', views.FetchBlogbyId.as_view(), name='fetch-blog-by-id'),
    path('fetch-blogs/', views.FetchBlogs.as_view(), name='fetch-blogs'),
]
