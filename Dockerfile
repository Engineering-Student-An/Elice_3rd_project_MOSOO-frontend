# MOSOO-FRONTEND /Dockerfile

# 1. Nginx 이미지를 기반으로 설정
FROM nginx:alpine

# 2. Nginx 기본 설정 파일 삭제
RUN rm -rf /usr/share/nginx/html/*

# 3. React build 파일을 컨테이너의 Nginx 경로로 복사
COPY build /usr/share/nginx/html

# 4. Nginx 설정 파일 복사 (필요 시 설정 변경 가능)
COPY etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 5. 컨테이너의 80 포트 노출
EXPOSE 80

# 6. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]